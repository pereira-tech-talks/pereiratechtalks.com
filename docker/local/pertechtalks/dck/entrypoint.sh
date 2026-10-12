# shellcheck shell=bash
#
# lib/entrypoint.sh — the devcontainer-kit entrypoint library.
#
# Baked into every base image at /usr/local/lib/dck/entrypoint.sh and sourced
# by /usr/local/bin/dck-entrypoint, which runs `dck_start` as root when the
# container starts and then execs the container command. A repository's own
# entrypoint may source it and call the functions it wants instead.
#
# One implementation of what used to be copied, with drift, into every
# repository's entrypoint:
#
#   dck_persist <name> <target> [dir|file]   named-volume symlink: seed on first
#                                            run, preserve on rebuild
#   dck_env_profile                          the container's environment for ssh
#                                            sessions (0600, O_EXCL, never logged)
#   dck_sshd                                 host keys generated at runtime into a
#                                            volume, public keys only
#   dck_authorize_keys [--add]               the dck block of authorized_keys
#   dck_herdr_config                         Herdr config defaults, in place
#   dck_repo_hook                            docker/local/dev-setup-hook.sh, if present
#   dck_layer_persist                        per-CLI volumes of the agents layer
#   dck_git_identity                         global git [user] settings from DCK_GIT_* (no host file)
#   dck_skills_link                          herdr-peers and Herdr skills into each agent's skills dir
#   dck_agent_trust                          the workspace trusted by Claude and Codex (autonomy on)
#   dck_ssh_agent_access                     the mounted host SSH agent socket usable by the user
#   dck_mesh_apply                           peers pushed by `dck` (stdin): ssh config, pinned host
#                                            keys and Herdr machines; no private key involved
#   dck_start                                the standard sequence of the above
#
# Inputs (environment; the compose file rendered by `dck init` sets them):
#   DCK_USER (dev)  DCK_HOME (that user's home)  DCK_WORKSPACE (/workspace)
#   DCK_SSH (1|0)   DCK_AUTHORIZED_KEYS          DCK_AGENTS ("claude codex ...")
#   DCK_PERSIST_ROOT ($DCK_HOME/.dck/volumes)    DCK_REPO_HOOK
#   DCK_HOST_PROFILES ("claude codex": ak profiles shared from the host)
#   DCK_HOST_CODEX (the host's Codex home, mounted)   AGENTKIT_PERMISSIONS
# For tests: DCK_ROOT prefixes every system path (/etc, /run) and
# DCK_SSHD_BIN replaces /usr/sbin/sshd.
#
# Values of environment variables are never printed: only names and counts.
# bash 3.2 compatible.

dck_log() { printf 'dck-entrypoint: %s\n' "$*" >&2; }

_dck_is_root() { [ "$(id -u)" = "0" ]; }

# Resolve the user, home and roots once per call (cheap, keeps functions usable
# on their own).
_dck_env() {
  DCK_USER="${DCK_USER:-dev}"
  if [ -z "${DCK_HOME:-}" ]; then
    DCK_HOME="$(getent passwd "$DCK_USER" 2>/dev/null | cut -d: -f6)"
    [ -n "$DCK_HOME" ] || DCK_HOME="/home/$DCK_USER"
  fi
  DCK_WORKSPACE="${DCK_WORKSPACE:-/workspace}"
  DCK_PERSIST_ROOT="${DCK_PERSIST_ROOT:-$DCK_HOME/.dck/volumes}"
  DCK_ROOT="${DCK_ROOT:-}"
  DCK_SSHD_BIN="${DCK_SSHD_BIN:-/usr/sbin/sshd}"
}

# chown to the dev user — only meaningful (and only attempted) as root.
_dck_chown() {
  _dck_is_root || return 0
  chown "$@" 2>/dev/null || true
}

_dck_group() { id -gn "$DCK_USER" 2>/dev/null || echo "$DCK_USER"; }

# --------------------------------------------------------------------------
# dck_persist <name> <target> [dir|file]
# --------------------------------------------------------------------------
# Keeps <target> (a path under the user's home) on the named volume mounted at
# $DCK_PERSIST_ROOT/<name>, through a symlink:
#   * first run (volume copy missing or empty): the image's copy seeds it;
#   * later runs and rebuilds: the volume copy wins, the image's is discarded;
#   * idempotent: a target already linked to its volume copy is left alone.
# The kind defaults to what the target is, or dir when it does not exist.

_dck_persist_key() {
  # .config/gh -> config_gh ; .claude.json -> claude.json
  local rel="$1"
  rel="${rel#.}"
  printf '%s' "$rel" | tr '/' '_'
}

# _dck_new_file <store> — create a missing (or repair an empty) persisted file. A
# JSON file gets "{}" so its program can parse it on first run: an empty
# ~/.claude.json, for one, is reported as corrupt and stops Claude Code.
_dck_new_file() {
  case "$1" in
    *.json) if [ ! -s "$1" ]; then printf '{}\n' > "$1"; fi ;;
    *) [ -e "$1" ] || : > "$1" ;;
  esac
}

dck_persist() {
  _dck_env
  local name="${1:-}" target="${2:-}" kind="${3:-}"
  case "$name" in
    ''|*[!a-z0-9_-]*) dck_log "persist: invalid volume name '$name'"; return 1 ;;
  esac
  case "$target" in
    "$DCK_HOME"/?*) ;;
    *) dck_log "persist: refusing '$target' (must be under $DCK_HOME)"; return 1 ;;
  esac
  case "$target" in
    */../*|*/..|*/./*|*//*) dck_log "persist: refusing '$target' (not a normalised path)"; return 1 ;;
  esac
  case "$target/" in
    "$DCK_PERSIST_ROOT"/*|"$DCK_HOME/.dck/") dck_log "persist: refusing '$target' (inside the volume root)"; return 1 ;;
  esac
  local vol="$DCK_PERSIST_ROOT/$name"
  local rel="${target#"$DCK_HOME"/}"
  local store
  store="$vol/$(_dck_persist_key "$rel")"
  if [ -z "$kind" ]; then
    if [ -f "$target" ] && [ ! -L "$target" ]; then kind="file"; else kind="dir"; fi
  fi
  case "$kind" in dir|file) ;; *) dck_log "persist: kind must be dir or file"; return 1 ;; esac
  mkdir -p "$vol" || return 1

  if [ -L "$target" ]; then
    if [ "$(readlink "$target")" = "$store" ]; then
      if [ "$kind" = dir ]; then mkdir -p "$store"; else _dck_new_file "$store"; fi
      _dck_chown -h "$DCK_USER:$(_dck_group)" "$target"
      return 0
    fi
    rm -f "$target"
  fi

  if [ -e "$target" ]; then
    local empty=0
    if [ ! -e "$store" ]; then
      empty=1
    elif [ "$kind" = dir ] && [ -d "$store" ] && [ -z "$(ls -A "$store" 2>/dev/null)" ]; then
      empty=1
    elif [ "$kind" = file ] && [ -f "$store" ] && [ ! -s "$store" ]; then
      empty=1
    fi
    if [ "$empty" = 1 ]; then
      rm -rf "$store"
      cp -a "$target" "$store" || { dck_log "persist: could not seed $store"; return 1; }
      dck_log "persist: seeded $name/${store##*/} from the image"
    else
      dck_log "persist: kept $name/${store##*/} from the volume"
    fi
    rm -rf "$target"
  fi

  if [ "$kind" = dir ]; then mkdir -p "$store"; else _dck_new_file "$store"; fi
  mkdir -p "$(dirname "$target")"
  ln -s "$store" "$target"
  _dck_chown "$DCK_USER:$(_dck_group)" "$vol"
  _dck_chown -R "$DCK_USER:$(_dck_group)" "$store"
  _dck_chown -h "$DCK_USER:$(_dck_group)" "$target"
}

# --------------------------------------------------------------------------
# dck_env_profile
# --------------------------------------------------------------------------
# sshd starts every session with a clean environment, so nothing compose
# passed in (env_file, environment) reaches an ssh/Herdr session. This writes
# the container's environment to $DCK_HOME/.dck/env.sh, which the login
# profile (/etc/profile.d/00-dck.sh) sources. The file holds whatever secrets
# compose was given, for the one user meant to have them: it is created 0600
# with O_EXCL|O_NOFOLLOW (no world-readable window, never written through a
# planted symlink) and atomically renamed into place. Values are never
# printed; only the number of variables is logged.

dck_env_profile() {
  _dck_env
  local out="$DCK_HOME/.dck/env.sh" count
  mkdir -p "$DCK_HOME/.dck"
  count="$(python3 -I - "$out" <<'PY'
import os, shlex, sys
out = sys.argv[1]
SKIP = {"PATH", "HOME", "HOSTNAME", "PWD", "OLDPWD", "SHLVL", "SHELL", "USER",
        "LOGNAME", "TERM", "_", "DCK_AUTHORIZED_KEYS", "SSH_AUTH_SOCK",
        "SSH_CONNECTION", "SSH_CLIENT", "SSH_TTY", "MAIL"}
lines = ["# Generated at container start by dck_env_profile from the container's",
         "# environment. Do not edit: rewritten on every start. Mode 0600.", ""]
n = 0
for k, v in sorted(os.environ.items()):
    if k in SKIP or not k or k[0].isdigit() or not k.replace("_", "").isalnum():
        continue
    lines.append("export %s=%s" % (k, shlex.quote(v)))
    n += 1
tmp = "%s.tmp-%d" % (out, os.getpid())
fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
with os.fdopen(fd, "w") as fh:
    fh.write("\n".join(lines) + "\n")
os.replace(tmp, out)
print(n)
PY
)" || { dck_log "env profile: could not write $out"; return 1; }
  _dck_chown "$DCK_USER:$(_dck_group)" "$DCK_HOME/.dck" "$out"
  dck_log "env profile: $count variable(s) available to ssh sessions (names only are ever logged)"
}

# --------------------------------------------------------------------------
# dck_authorize_keys [--add]
# --------------------------------------------------------------------------
# Maintains the block between "# >>> dck >>>" and "# <<< dck <<<" in
# ~/.ssh/authorized_keys; lines outside it are the user's and are kept.
#   (no flag)  the block becomes the keys in $DCK_AUTHORIZED_KEYS, when set
#              (an empty variable leaves the block as it is)
#   --add      adds the public key(s) read from stdin to the block
# Only well-formed public keys are accepted; anything else is refused.

_dck_valid_pubkeys() {
  LC_ALL=C grep -E '^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp(256|384|521)|sk-ssh-ed25519@openssh\.com|sk-ecdsa-sha2-nistp256@openssh\.com) [A-Za-z0-9+/]+={0,3}( [ -~]*)?$' || true
}

# shellcheck disable=SC2120  # the optional --add is used by `dck herdr add` through docker exec
dck_authorize_keys() {
  _dck_env
  local mode="${1:-env}" keys ak="$DCK_HOME/.ssh/authorized_keys"
  if [ "$mode" = "--add" ]; then
    keys="$(_dck_valid_pubkeys)"
  else
    [ -n "${DCK_AUTHORIZED_KEYS:-}" ] || return 0
    keys="$(printf '%s\n' "$DCK_AUTHORIZED_KEYS" | _dck_valid_pubkeys)"
  fi
  if [ -z "$keys" ]; then
    dck_log "authorized keys: no valid public key given; nothing changed"
    [ "$mode" = "--add" ] && return 1
    return 0
  fi
  mkdir -p "$DCK_HOME/.ssh"
  chmod 0700 "$DCK_HOME/.ssh"
  [ -e "$ak" ] || : > "$ak"
  python3 -I - "$ak" "$mode" "$keys" <<'PY'
import os, sys
path, mode, keys = sys.argv[1], sys.argv[2], sys.argv[3].splitlines()
BEGIN, END = "# >>> dck >>>", "# <<< dck <<<"
lines = open(path).read().splitlines()
outside, block, state = [], [], 0
for ln in lines:
    if ln == BEGIN and state == 0:
        state = 1
    elif ln == END and state == 1:
        state = 2
    elif state == 1:
        block.append(ln)
    else:
        outside.append(ln)
if mode == "--add":
    for k in keys:
        if k not in block:
            block.append(k)
else:
    block = keys
new = outside + [BEGIN] + block + [END]
tmp = "%s.tmp-%d" % (path, os.getpid())
fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
with os.fdopen(fd, "w") as fh:
    fh.write("\n".join(new) + "\n")
os.replace(tmp, path)
PY
  _dck_chown "$DCK_USER:$(_dck_group)" "$DCK_HOME/.ssh" "$ak"
  dck_log "authorized keys: $(printf '%s\n' "$keys" | wc -l | tr -d ' ') key(s) in the dck block"
}

# --------------------------------------------------------------------------
# dck_sshd
# --------------------------------------------------------------------------
# Starts sshd for Herdr and `dck ssh` when DCK_SSH=1. The host key is
# generated once into the persistent state volume (never baked into the image,
# never regenerated on recreate, so clients' pinned keys stay valid). The
# image's drop-in already forbids passwords and root; this adds the runtime
# part: the HostKey and `AllowUsers <user>`. The host publishes the port on
# 127.0.0.1 only.

# dck_host_key_pub — print the persistent host key's public half (nothing when
# it does not exist yet). `dck ssh` and `dck herdr add` read it through
# `docker exec` to pin the key from the container itself, never from the network.
dck_host_key_pub() {
  _dck_env
  local f="${DCK_SSH_HOST_KEY_DIR:-$DCK_PERSIST_ROOT/state/ssh_host_keys}/ssh_host_ed25519_key.pub"
  [ -f "$f" ] && [ ! -L "$f" ] && head -n 1 "$f"
  return 0
}

dck_sshd() {
  _dck_env
  if [ "${DCK_SSH:-0}" != "1" ]; then
    dck_log "sshd: disabled (ssh_port = 0)"
    return 0
  fi
  if [ ! -x "$DCK_SSHD_BIN" ]; then
    dck_log "sshd: $DCK_SSHD_BIN not found; Herdr and dck ssh are unavailable"
    return 1
  fi
  local keydir="${DCK_SSH_HOST_KEY_DIR:-$DCK_PERSIST_ROOT/state/ssh_host_keys}"
  local key="$keydir/ssh_host_ed25519_key"
  local conf="$DCK_ROOT/etc/ssh/sshd_config.d/20-dck-runtime.conf"
  mkdir -p "$keydir" "$DCK_ROOT/run/sshd" "$(dirname "$conf")"
  chmod 0700 "$keydir"
  if [ ! -f "$key" ]; then
    ssh-keygen -q -t ed25519 -N '' -C "dck-host-key" -f "$key" || { dck_log "sshd: could not generate a host key"; return 1; }
    dck_log "sshd: generated a persistent host key ($(ssh-keygen -lf "$key.pub" | cut -d' ' -f2))"
  fi
  if _dck_is_root; then chown -R root:root "$keydir" 2>/dev/null || true; fi
  chmod 0600 "$key"
  chmod 0644 "$key.pub"
  {
    echo "# Written by dck_sshd at container start."
    echo "HostKey $key"
    echo "AllowUsers $DCK_USER"
  } > "$conf"
  chmod 0644 "$conf"
  dck_authorize_keys || true
  local err
  if ! err="$("$DCK_SSHD_BIN" -t 2>&1)"; then
    dck_log "sshd: configuration invalid, not started: $err"
    return 1
  fi
  "$DCK_SSHD_BIN" || { dck_log "sshd: failed to start"; return 1; }
  dck_log "sshd: listening on container port 22 (public keys only)"
}

# --------------------------------------------------------------------------
# dck_herdr_config
# --------------------------------------------------------------------------
# Herdr reads ~/.config/herdr/config.toml. Keeps the keys the container needs
# present without overwriting a developer's own values:
#   onboarding = false; [terminal] default_shell = "/bin/bash",
#   shell_mode = "login" (also repairing a "non_login" value: a non-login
#   shell never reads /etc/profile.d, so tools vanish from PATH),
#   new_cwd = <workspace>; [experimental] allow_nested = true (always: the
#   container's Herdr runs inside the host's).
# Duplicate tables (invalid TOML that makes Herdr ignore the whole file) are
# merged. A file that needs no change is not rewritten.

dck_herdr_config() {
  _dck_env
  local cfg="$DCK_HOME/.config/herdr/config.toml"
  mkdir -p "$(dirname "$cfg")"
  [ -e "$cfg" ] || : > "$cfg"
  python3 -I - "$cfg" "$DCK_WORKSPACE" <<'PY' || { dck_log "herdr config: could not update $cfg"; return 1; }
import os, re, sys
path, workspace = sys.argv[1], sys.argv[2]
text = open(path).read()
HEADER = re.compile(r"^\s*\[([^\[\]]+)\]\s*(#.*)?$")
KEY = re.compile(r"^\s*([A-Za-z0-9_-]+)\s*=")
order, tables = [""], {"": []}
cur = ""
for ln in text.splitlines():
    m = HEADER.match(ln)
    if m:
        cur = m.group(1).strip()
        if cur not in tables:
            tables[cur] = []
            order.append(cur)
        continue
    tables[cur].append(ln)

def keys(t):
    return {KEY.match(l).group(1): i for i, l in enumerate(tables.get(t, [])) if KEY.match(l)}

def ensure(t, k, v, force=False, repair=None):
    if t not in tables:
        tables[t] = []
        order.append(t)
    ks = keys(t)
    line = "%s = %s" % (k, v)
    if k not in ks:
        body = tables[t]
        while body and not body[-1].strip():
            body.pop()
        body.append(line)
    elif force or (repair and tables[t][ks[k]].split("=", 1)[1].strip() == repair):
        tables[t][ks[k]] = line

ensure("", "onboarding", "false")
ensure("terminal", "default_shell", '"/bin/bash"')
ensure("terminal", "shell_mode", '"login"', repair='"non_login"')
# The image seeds new_cwd = "/workspace" (the template default); a repository whose
# workspace is elsewhere (/app) would open every new pane in ~. Repair that seed
# value; any other value is the user's and stays.
ensure("terminal", "new_cwd", '"%s"' % workspace, repair='"/workspace"')
ensure("experimental", "allow_nested", "true", force=True)

out = []
for t in order:
    body = tables[t]
    while body and not body[-1].strip():
        body.pop()
    if t:
        if out:
            out.append("")
        out.append("[%s]" % t)
    out.extend(body)
new = "\n".join(out).lstrip("\n") + "\n"
if new != text:
    tmp = "%s.tmp-%d" % (path, os.getpid())
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o644)
    with os.fdopen(fd, "w") as fh:
        fh.write(new)
    os.replace(tmp, path)
    sys.stderr.write("dck-entrypoint: herdr config: updated\n")
PY
  # The real directory (it is usually a symlink onto the state volume, and
  # chown -R does not traverse a symlink given as its operand).
  _dck_chown -R "$DCK_USER:$(_dck_group)" "$(cd -P "$(dirname "$cfg")" && pwd)"
}

# --------------------------------------------------------------------------
# dck_repo_hook
# --------------------------------------------------------------------------
# Runs the repository's docker/local/dev-setup-hook.sh (if present) as the
# dev user, from the workspace. A failing hook is reported, never fatal: the
# container still starts so the developer can fix it from inside.

dck_repo_hook() {
  _dck_env
  local hook="${DCK_REPO_HOOK:-$DCK_WORKSPACE/docker/local/dev-setup-hook.sh}" rc=0
  [ -f "$hook" ] || return 0
  dck_log "repo hook: running ${hook#"$DCK_WORKSPACE"/} as $DCK_USER"
  if _dck_is_root && [ "$DCK_USER" != "root" ]; then
    if command -v runuser >/dev/null 2>&1; then
      (cd "$DCK_WORKSPACE" 2>/dev/null || cd /; runuser -u "$DCK_USER" -- env HOME="$DCK_HOME" bash "$hook") || rc=$?
    else
      (cd "$DCK_WORKSPACE" 2>/dev/null || cd /; su -s /bin/bash "$DCK_USER" -c "HOME='$DCK_HOME' bash '$hook'") || rc=$?
    fi
  else
    (cd "$DCK_WORKSPACE" 2>/dev/null || cd /; bash "$hook") || rc=$?
  fi
  [ "$rc" = 0 ] || dck_log "repo hook: exited $rc (the container keeps running)"
  return 0
}

# --------------------------------------------------------------------------
# dck_layer_persist — homes of the opt-in layers
# --------------------------------------------------------------------------
# For each kind in DCK_AGENTS, the CLI's home directories go on the named
# volume of the same name (one volume per CLI, declared by the template);
# coding-agents-kit's config (~/.config/agentkit, env file mode 600) goes on
# the agentkit volume (its profiles directory is set there through
# AGENTKIT_PROFILES_DIR). With DCK_DAILYBOT=1 the Dailybot CLI's config goes
# on the state volume. Unknown kinds are logged and skipped.

dck_agent_homes() {
  case "$1" in
    claude)   printf '%s\n' ".claude dir" ".claude.json file" ;;
    codex)    printf '%s\n' ".codex dir" ;;
    cursor)   printf '%s\n' ".cursor dir" ".config/cursor dir" ;;
    opencode) printf '%s\n' ".config/opencode dir" ".local/share/opencode dir" ;;
    pi)       printf '%s\n' ".pi dir" ;;
    cline)    printf '%s\n' ".cline dir" ;;
    grok)     printf '%s\n' ".grok dir" ;;
    *) return 1 ;;
  esac
}

dck_layer_persist() {
  _dck_env
  local kind rel k
  if [ -n "${DCK_AGENTS:-}" ]; then
    dck_persist agentkit "$DCK_HOME/.config/agentkit" dir || true
    mkdir -p "$DCK_PERSIST_ROOT/agentkit/profiles"
    _dck_chown "$DCK_USER:$(_dck_group)" "$DCK_PERSIST_ROOT/agentkit/profiles"
    dck_host_homes
    for kind in $DCK_AGENTS; do
      if ! dck_agent_homes "$kind" >/dev/null; then
        dck_log "agents: unknown kind '$kind' skipped"
        continue
      fi
      # [agents] host_profiles: ~/.codex is the host's Codex home, never a volume.
      if [ "$kind" = codex ] && _dck_host_codex; then
        dck_link_host_codex || true
        continue
      fi
      while read -r rel k; do
        dck_persist "$kind" "$DCK_HOME/$rel" "$k" || true
      done <<HOMES
$(dck_agent_homes "$kind")
HOMES
    done
  fi
  if [ "${DCK_DAILYBOT:-0}" = "1" ]; then
    dck_persist state "$DCK_HOME/.config/dailybot" dir || true
  fi
}

# --------------------------------------------------------------------------
# Host accounts ([agents] host_profiles, docs/layers.md)
# --------------------------------------------------------------------------
# `dck up` binds the host's ak profiles under $DCK_HOME/.dck/host/agentkit/
# profiles/<cli>, the host's Codex home at $DCK_HOME/.dck/host/codex
# (DCK_HOST_CODEX) and an allow-listed env file read-only at
# $DCK_HOME/.dck/host/agentkit/env. Docker creates the parents of those mount
# points as root; they are given to the user (never recursively: the mounts
# are the host's files and are never chowned).

_dck_host_codex() {
  case "${DCK_HOST_CODEX:-}" in "$DCK_HOME"/.dck/host/*) [ -d "$DCK_HOST_CODEX" ] ;; *) return 1 ;; esac
}

dck_host_homes() {
  local d
  # The per-CLI directories hold one bind mount per profile: docker creates
  # them, the profiles inside are the host's (never chowned).
  for d in "$DCK_HOME/.dck/host" "$DCK_HOME/.dck/host/agentkit" "$DCK_HOME/.dck/host/agentkit/profiles" \
           "$DCK_HOME"/.dck/host/agentkit/profiles/*; do
    [ -d "$d" ] && [ ! -L "$d" ] && _dck_chown "$DCK_USER:$(_dck_group)" "$d"
  done
  return 0
}

# ~/.codex -> the mounted host Codex home. The image's copy (or the link to the
# codex volume) is replaced; the volume keeps its contents for when the option
# is turned off again (dck_persist then links the volume back).
dck_link_host_codex() {
  local target="$DCK_HOME/.codex"
  if [ -L "$target" ] && [ "$(readlink "$target")" = "$DCK_HOST_CODEX" ]; then return 0; fi
  if [ -L "$target" ] || [ -f "$target" ]; then
    rm -f "$target"
  elif [ -d "$target" ]; then
    rm -rf "$target"
  fi
  ln -s "$DCK_HOST_CODEX" "$target"
  _dck_chown -h "$DCK_USER:$(_dck_group)" "$target"
  dck_log "agents: ~/.codex is the host's Codex home (host_profiles)"
}

# Autonomy is off when AGENTKIT_PERMISSIONS=ask is in the environment or in
# the env file ak reads.
_dck_autonomy_off() {
  local f
  case "$(printf '%s' "${AGENTKIT_PERMISSIONS:-}" | tr 'A-Z' 'a-z')" in ask) return 0 ;; esac
  for f in "${AGENTKIT_ENV:-}" "$DCK_HOME/.config/agentkit/env"; do
    [ -n "$f" ] && [ -f "$f" ] || continue
    grep -Eqi "^[[:space:]]*(export[[:space:]]+)?AGENTKIT_PERMISSIONS=[\"']?ask[\"']?[[:space:]]*(#.*)?$" "$f" 2>/dev/null && return 0
  done
  return 1
}

# --------------------------------------------------------------------------
# dck_agent_trust — unattended agent launches
# --------------------------------------------------------------------------
# With autonomy on (the default; AGENTKIT_PERMISSIONS=ask turns it off) a new
# agent must not stop at a first-run screen. For the CLIs in DCK_AGENTS:
#   * folder trust for the workspace (the app path) — in the container's own
#     CLI homes AND in the shared host profiles (an entry for a container path
#     such as /app is inert on the host): Claude's
#     projects[<path>].hasTrustDialogAccepted, Codex's
#     [projects."<path>"] trust_level = "trusted";
#   * Claude's bypass-permissions acknowledgement (and its onboarding) — ONLY
#     in the container's own homes, NEVER in a shared host profile: those also
#     drive the user's Claude on the host, where a human acknowledges it once
#     per profile.
# With AGENTKIT_PERMISSIONS=ask neither is written. Each file is read, changed
# only when something is missing and replaced atomically; an unreadable or
# invalid file is left alone.
dck_agent_trust() {
  _dck_env
  [ -n "${DCK_AGENTS:-}" ] || return 0
  if _dck_autonomy_off; then
    dck_log "agent trust: AGENTKIT_PERMISSIONS=ask; no folder trust or acknowledgement written"
    return 0
  fi
  local profiles="${AGENTKIT_PROFILES_DIR:-$DCK_PERSIST_ROOT/agentkit/profiles}" kind dir own specs=""
  for kind in $DCK_AGENTS; do
    case " ${DCK_HOST_PROFILES:-} " in *" $kind "*) own=host ;; *) own=own ;; esac
    case "$kind" in
      claude)
        specs="$specs
claude-default	own	$DCK_HOME"
        for dir in "$profiles"/claude/*; do
          [ -d "$dir" ] && [ ! -L "$dir" ] && specs="$specs
claude	$own	$dir"
        done ;;
      codex)
        if _dck_host_codex; then
          specs="$specs
codex	host	$DCK_HOST_CODEX"
        else
          specs="$specs
codex	own	$DCK_HOME/.codex"
        fi
        for dir in "$profiles"/codex/*; do
          [ -d "$dir" ] && [ ! -L "$dir" ] && specs="$specs
codex	$own	$dir"
        done ;;
    esac
  done
  [ -n "$specs" ] || return 0
  printf '%s\n' "$specs" | _dck_as_user python3 -I -c '
import json, os, re, sys
ws = sys.argv[1]
changed = 0

def replace(path, text, mode):
    tmp = "%s.dck-%d" % (path, os.getpid())
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, mode)
    with os.fdopen(fd, "w") as fh:
        fh.write(text)
    os.replace(tmp, path)

def edit_json(path, fn):
    global changed
    if os.path.islink(path):
        return
    mode = 0o600
    data = {}
    if os.path.exists(path):
        mode = os.stat(path).st_mode & 0o777
        try:
            with open(path) as fh:
                raw = fh.read()
            data = json.loads(raw) if raw.strip() else {}
        except (OSError, ValueError):
            sys.stderr.write("dck-entrypoint: agent trust: %s is not valid JSON; left alone\n" % path)
            return
        if not isinstance(data, dict):
            return
    if fn(data):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        replace(path, json.dumps(data, indent=2) + "\n", mode)
        changed += 1

def claude_trust(d):
    proj = d.setdefault("projects", {})
    if not isinstance(proj, dict):
        return False
    entry = proj.setdefault(ws, {})
    if not isinstance(entry, dict) or entry.get("hasTrustDialogAccepted") is True:
        return False
    entry["hasTrustDialogAccepted"] = True
    return True

def claude_own(d):
    new = claude_trust(d)
    for k in ("hasCompletedOnboarding", "bypassPermissionsModeAccepted"):
        if d.get(k) is not True:
            d[k] = True
            new = True
    return new

def settings_own(d):
    if d.get("skipDangerousModePermissionPrompt") is True:
        return False
    d["skipDangerousModePermissionPrompt"] = True
    return True

def codex(path):
    global changed
    if os.path.islink(path):
        return
    mode, lines = 0o600, []
    if os.path.exists(path):
        mode = os.stat(path).st_mode & 0o777
        try:
            with open(path) as fh:
                lines = fh.read().splitlines()
        except OSError:
            return
    headers = ("[projects.\"%s\"]" % ws, "[projects.'%s']" % ws)
    start = next((i for i, l in enumerate(lines) if l.strip() in headers), None)
    if start is None:
        if lines and lines[-1].strip():
            lines.append("")
        lines += [headers[0], "trust_level = \"trusted\""]
    else:
        end = next((i for i in range(start + 1, len(lines)) if lines[i].lstrip().startswith("[")), len(lines))
        at = next((i for i in range(start + 1, end) if re.match(r"^\s*trust_level\s*=", lines[i])), None)
        if at is not None and re.match(r"^\s*trust_level\s*=\s*\"trusted\"\s*$", lines[at]):
            return
        if at is None:
            lines.insert(start + 1, "trust_level = \"trusted\"")
        else:
            lines[at] = "trust_level = \"trusted\""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    replace(path, "\n".join(lines) + "\n", mode)
    changed += 1

for line in sys.stdin.read().splitlines():
    if line.count("\t") != 2:
        continue
    kind, owner, d = line.split("\t")
    if kind == "claude-default":
        edit_json(os.path.join(d, ".claude.json"), claude_own)
        edit_json(os.path.join(d, ".claude", "settings.json"), settings_own)
    elif kind == "claude":
        edit_json(os.path.join(d, ".claude.json"), claude_own if owner == "own" else claude_trust)
        if owner == "own":
            edit_json(os.path.join(d, "settings.json"), settings_own)
    elif kind == "codex":
        if os.path.isdir(d):
            codex(os.path.join(d, "config.toml"))
print(changed)
' "$DCK_WORKSPACE" | {
    read -r n
    dck_log "agent trust: workspace $DCK_WORKSPACE trusted for ${DCK_AGENTS} (${n:-0} file(s) updated)"
  }
  return 0
}

# --------------------------------------------------------------------------
# dck_start — the standard sequence (what /usr/local/bin/dck-entrypoint runs)
# --------------------------------------------------------------------------

# dck_git_identity — write the git identity from DCK_GIT_NAME, DCK_GIT_EMAIL and
# the optional signing settings (DCK_GIT_SIGNINGKEY, DCK_GIT_GPG_FORMAT,
# DCK_GIT_COMMIT_GPGSIGN) into the dev user's global git config. Values are
# never printed; an unset variable leaves that key alone.
dck_git_identity() {
  _dck_env
  local pairs="user.name=DCK_GIT_NAME user.email=DCK_GIT_EMAIL user.signingkey=DCK_GIT_SIGNINGKEY gpg.format=DCK_GIT_GPG_FORMAT commit.gpgsign=DCK_GIT_COMMIT_GPGSIGN"
  local pair key var value set=0 sign_ok=0
  # Only SSH signing with a key:: literal works inside (no gpg key, no host
  # path); anything else — e.g. a .env written by v0.2.0 — is skipped.
  if [ "${DCK_GIT_GPG_FORMAT:-}" = "ssh" ]; then
    case "${DCK_GIT_SIGNINGKEY:-}" in key::*) sign_ok=1 ;; esac
  fi
  if [ "$sign_ok" -eq 0 ] && [ -n "${DCK_GIT_SIGNINGKEY:-}${DCK_GIT_COMMIT_GPGSIGN:-}" ]; then
    dck_log "git identity: signing settings skipped (only gpg.format=ssh with a key:: signing key works here)"
  fi
  for pair in $pairs; do
    key="${pair%%=*}"; var="${pair#*=}"
    case "$key" in user.signingkey|gpg.format|commit.gpgsign) [ "$sign_ok" -eq 1 ] || continue ;; esac
    value="${!var:-}"
    [ -n "$value" ] || continue
    case "$value" in *"
"*) dck_log "git identity: $var spans several lines; ignored"; continue ;; esac
    if _dck_is_root && [ "$DCK_USER" != "root" ]; then
      runuser -u "$DCK_USER" -- env HOME="$DCK_HOME" git config --global "$key" "$value" || return 1
    else
      HOME="$DCK_HOME" git config --global "$key" "$value" || return 1
    fi
    set=$((set + 1))
  done
  [ "$set" -eq 0 ] || dck_log "git identity: $set setting(s) written from DCK_GIT_*"
}

# dck_skills_link — link the image's shared skills (/usr/local/share/dck/skills:
# herdr-peers, herdr) into every agent skill directory that exists, plus the
# cross-agent ~/.agents/skills. Agent homes live on volumes, so linking at each
# start keeps the skills current across rebuilds. Never replaces a real
# directory the user put there.
dck_skills_link() {
  _dck_env
  local src="${DCK_SKILLS_SRC:-/usr/local/share/dck/skills}" dir skill target top
  [ -d "$src" ] || return 0
  # v0.2.0 created these parents as root; give them back to the user.
  for top in "$DCK_HOME/.agents" "$DCK_HOME/.claude"; do
    if [ -d "$top" ] && [ ! -L "$top" ] && [ "$(stat -c %u "$top" 2>/dev/null)" = "0" ] && [ "$DCK_USER" != "root" ]; then
      _dck_chown "$DCK_USER:$(_dck_group)" "$top"
    fi
  done
  for dir in "$DCK_HOME/.agents/skills" "$DCK_HOME/.claude/skills" "$DCK_HOME/.codex/skills" \
             "$DCK_HOME/.cursor/skills" "$DCK_HOME/.config/opencode/skill"; do
    # The host's Codex home (host_profiles): container paths must not land in it.
    if [ "$dir" = "$DCK_HOME/.codex/skills" ] && _dck_host_codex; then continue; fi
    case "$dir" in
      "$DCK_HOME/.agents/skills"|"$DCK_HOME/.claude/skills") _dck_as_user mkdir -p "$dir" || continue ;;
      *) [ -d "$(dirname "$dir")" ] || continue; _dck_as_user mkdir -p "$dir" || continue ;;
    esac
    for skill in "$src"/*; do
      [ -d "$skill" ] || continue
      target="$dir/$(basename "$skill")"
      if [ -e "$target" ] && [ ! -L "$target" ]; then continue; fi
      ln -sfn "$skill" "$target"
    done
    _dck_chown "$DCK_USER:$(_dck_group)" "$dir"
  done
}

# dck_mesh_apply — read the peer list `dck` pushes from the host (stdin) and
# make every peer reachable from inside: an ssh config fragment
# (~/.ssh/config.d/dck-peers, HostName host.docker.internal, ForwardAgent no,
# strict host keys), the pinned known_hosts for them, and a Herdr machine per
# peer. Input lines (anything else is refused):
#   peer <alias> <port> <user> <label...>
#   self <alias> <port> <user>   (this container reaching itself: herdr-peers finds its own machine)
#   hostkey <port> <keytype> <base64-key>
#   disabled <alias>      (a peer disabled in the host's Herdr: registered disabled here)
#   catalog <id> <0|1> <session> <alias> <label...>   (the host's Herdr catalog entry)
# With catalog lines (dck v0.2.6+), the container's Herdr catalog becomes a copy
# of those entries — the host's own ids — so a herdr-peers reply address
# (<machine id>:<pane>) means the same machine on both sides. Without them (an
# older dck on the host) each peer is registered with `herdr machine add`.
# Runs as root (dck exec) or as the user; writes as the user. Authentication
# uses the host's agent socket mounted in this container: no private key is
# read, written or required here, and the agent is never forwarded onward.
dck_mesh_apply() {
  _dck_env
  if [ -f "$DCK_PERSIST_ROOT/state/.mesh-off" ] && [ "${DCK_MESH_FORCE:-0}" != "1" ]; then
    cat >/dev/null
    dck_log "mesh: off for this repository ([herdr] mesh = false); nothing applied"
    return 0
  fi
  local ssh_dir="$DCK_HOME/.ssh" frag known cfg tmp_frag tmp_known kind a b c d rest n=0
  frag="$ssh_dir/config.d/dck-peers"
  known="$ssh_dir/known_hosts.dck-peers"
  cfg="$ssh_dir/config"
  mkdir -p "$ssh_dir/config.d"
  tmp_frag="$(mktemp "$frag.XXXXXX")"; tmp_known="$(mktemp "$known.XXXXXX")"
  printf '# Generated by devcontainer-kit (dck herdr mesh). Do not edit.\n\n' > "$tmp_frag"
  local labels="" disabled=" " written=" " catalog=""
  while read -r kind a b c d rest; do
    case "$kind" in
      peer|self)
        case "$a" in ''|[![:alnum:]]*|*[![:alnum:]._-]*) dck_log "mesh: refusing alias"; continue ;; esac
        case "$b" in ''|*[!0-9]*) dck_log "mesh: refusing port for $a"; continue ;; esac
        [ "$b" -ge 1 ] && [ "$b" -le 65535 ] || { dck_log "mesh: refusing port for $a"; continue; }
        case "$c" in ''|[![:lower:]_]*|*[![:lower:][:digit:]_.-]*) dck_log "mesh: refusing user for $a"; continue ;; esac
        case "$written" in *" $a "*) continue ;; esac
        printf 'Host %s\n  HostName host.docker.internal\n  Port %s\n  User %s\n  ForwardAgent no\n  IdentitiesOnly no\n  UserKnownHostsFile %s\n  StrictHostKeyChecking yes\n\n' \
          "$a" "$b" "$c" "$known" >> "$tmp_frag"
        written="$written$a "
        [ "$kind" = self ] && continue
        labels="$labels$a $(printf '%s %s' "$d" "$rest" | tr -cd '[:alnum:] ._:@()/-' | sed -e 's/ *$//' -e 's/^[- ]*//')
"
        n=$((n + 1)) ;;
      catalog)
        case "$a" in ''|*[!0-9a-f]*) dck_log "mesh: refusing a catalog id"; continue ;; esac
        [ "${#a}" -eq 32 ] || { dck_log "mesh: refusing a catalog id"; continue; }
        case "$b" in 0|1) ;; *) continue ;; esac
        case "$c" in ''|*[![:alnum:]._-]*) dck_log "mesh: refusing a catalog session"; continue ;; esac
        case "$d" in ''|[![:alnum:]]*|*[![:alnum:]._-]*) dck_log "mesh: refusing a catalog alias"; continue ;; esac
        catalog="$catalog$a $b $c $d $(printf '%s' "$rest" | tr -cd '[:alnum:] ._:@()/-' | sed -e 's/ *$//' -e 's/^[- ]*//')
" ;;
      hostkey)
        case "$a" in ''|*[!0-9]*) continue ;; esac
        case "$b" in ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521) ;; *) continue ;; esac
        case "$c" in ''|*[![:alnum:]+/=]*) continue ;; esac
        if [ "$a" = "22" ]; then
          printf 'host.docker.internal %s %s\n' "$b" "$c" >> "$tmp_known"
        else
          printf '[host.docker.internal]:%s %s %s\n' "$a" "$b" "$c" >> "$tmp_known"
        fi ;;
      disabled)
        case "$a" in ''|[![:alnum:]]*|*[![:alnum:]._-]*) continue ;; esac
        disabled="$disabled$a " ;;
      ''|'#'*) ;;
      *) dck_log "mesh: refusing an unknown line" ;;
    esac
  done
  chmod 0600 "$tmp_frag" "$tmp_known"
  mv "$tmp_frag" "$frag"; mv "$tmp_known" "$known"
  touch "$cfg"; chmod 0600 "$cfg"
  if ! grep -qxF "Include config.d/dck-peers" "$cfg"; then
    { printf 'Include config.d/dck-peers\n'; cat "$cfg"; } > "$cfg.dck-tmp" && mv "$cfg.dck-tmp" "$cfg"
  fi
  _dck_chown -R "$DCK_USER:$(_dck_group)" "$ssh_dir/."  # ~/.ssh is a symlink into the state volume: chown its contents
  dck_log "mesh: $n peer(s) written"
  if [ -n "$catalog" ]; then
    dck_mesh_catalog "$written" "$catalog"
    return 0
  fi
  # Herdr machines (best-effort: the container's Herdr server may not run yet).
  command -v herdr >/dev/null 2>&1 || return 0
  local alias label registered
  registered="$(_dck_as_user herdr machine list --json 2>/dev/null || true)"
  while read -r alias label; do
    [ -n "$alias" ] || continue
    case "$registered" in *"\"$alias\""*) continue ;; esac
    if _dck_as_user herdr machine add --label "${label:-$alias}" "$alias" >/dev/null 2>&1; then
      dck_log "mesh: registered Herdr machine $alias"
    else
      dck_log "mesh: Herdr machine $alias not registered yet (the container's Herdr server is not running); run dck herdr mesh again after attaching"
    fi
  done <<EOF
$labels
EOF
  # Mirror the host's enabled/disabled state for the pushed peers.
  registered="$(_dck_as_user herdr machine list --json 2>/dev/null || true)"
  local id want
  while read -r alias label; do
    [ -n "$alias" ] || continue
    id="$(printf '%s' "$registered" | python3 -I -c '
import json, sys
raw = sys.stdin.read(); i = min([p for p in (raw.find("["), raw.find("{")) if p >= 0] or [-1])
data = json.loads(raw[i:]) if i >= 0 else []
if isinstance(data, dict):
    data = (data.get("result") or {}).get("machines") or data.get("machines") or []
for m in data:
    if isinstance(m, dict) and m.get("target") == sys.argv[1]:
        print("%s %s" % (m.get("id", ""), "1" if m.get("enabled", True) else "0")); break
' "$alias" 2>/dev/null || true)"
    [ -n "$id" ] || continue
    want=1
    case "$disabled" in *" $alias "*) want=0 ;; esac
    [ "${id#* }" = "$want" ] && continue
    if [ "$want" = 0 ]; then
      _dck_as_user herdr machine disable "${id%% *}" >/dev/null 2>&1 && dck_log "mesh: $alias is disabled (as on the host)"
    else
      _dck_as_user herdr machine enable "${id%% *}" >/dev/null 2>&1 && dck_log "mesh: $alias is enabled (as on the host)"
    fi
  done <<EOF
$labels
EOF
}

# dck_mesh_catalog "<aliases written>" "<catalog lines>" — write Herdr's saved
# machines (~/.local/state/herdr/client/endpoints.json) as a copy of the host's
# entries whose alias this container can reach. Atomic; the previous file is
# kept once as endpoints.json.dck-bak.
dck_mesh_catalog() {
  _dck_env
  local dir="$DCK_HOME/.local/state/herdr/client" n
  [ -d "$dir" ] || { mkdir -p "$dir" && _dck_chown "$DCK_USER:$(_dck_group)" "$dir"; }
  n="$(python3 -I - "$dir" "$1" "$2" <<'PY'
import json, os, re, sys
d, written, raw = sys.argv[1], set(sys.argv[2].split()), sys.argv[3]
entries, seen = [], set()
for ln in raw.splitlines():
    p = ln.split(" ", 4)
    if len(p) < 4:
        continue
    mid, enabled, session, target = p[0], p[1], p[2], p[3]
    label = p[4] if len(p) > 4 and p[4] else target
    if (not re.match(r"^[0-9a-f]{32}$", mid) or enabled not in ("0", "1") or target not in written
            or not re.match(r"^[A-Za-z0-9._-]+$", session) or mid in seen):
        continue
    seen.add(mid)
    entries.append({"id": mid, "label": label, "target": target, "session": session, "enabled": enabled == "1"})
path = os.path.join(d, "endpoints.json")
if os.path.islink(path):
    sys.exit("endpoints.json is a symlink; refusing")
if os.path.isfile(path):
    with open(path, "rb") as src, open(path + ".dck-bak.tmp", "wb") as dst:
        dst.write(src.read())
    os.replace(path + ".dck-bak.tmp", path + ".dck-bak")
tmp = "%s.tmp-%d" % (path, os.getpid())
fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
with os.fdopen(fd, "w") as fh:
    json.dump({"version": 1, "ssh": entries}, fh, indent=2)
    fh.write("\n")
os.replace(tmp, path)
print(len(entries))
PY
)" || { dck_log "mesh: could not write Herdr's catalog"; return 1; }
  _dck_chown "$DCK_USER:$(_dck_group)" "$dir/endpoints.json" "$dir/endpoints.json.dck-bak"
  dck_log "mesh: Herdr catalog mirrored from the host ($n machine(s), the host's ids)"
}

# dck_mesh_optout set|clear — record [herdr] mesh = false for this repository in
# its state volume; dck_mesh_apply then ignores refreshes pushed from elsewhere.
dck_mesh_optout() {
  _dck_env
  local m="$DCK_PERSIST_ROOT/state/.mesh-off"
  case "${1:-}" in
    set) mkdir -p "$DCK_PERSIST_ROOT/state" && : > "$m" && dck_log "mesh: off for this repository" ;;
    clear) rm -f "$m" ;;
    *) return 2 ;;
  esac
}

# dck_hostssh_apply — the developer's own SSH aliases, from the host (stdin, sent
# by `dck up`): the public half of each key and one Host block per alias, so git
# and ssh inside use the same aliases and keys as the host. The private keys stay
# in the host's agent; IdentityFile points at the .pub, which tells OpenSSH which
# agent key to use. Input lines (anything else is refused):
#   pub  <key> <type> <base64>
#   host <alias> <hostname> <port> <user|-> <key>
#   kh   <hostname> <port> <type> <base64>   (host keys the developer already trusts)
dck_hostssh_apply() {
  _dck_env
  local ssh_dir="$DCK_HOME/.ssh" keydir frag cfg tmp kind a b c d e n=0 lines="" pubs=" " known ktmp
  keydir="$ssh_dir/dck-host-keys"; frag="$ssh_dir/config.d/dck-host"; cfg="$ssh_dir/config"
  known="$ssh_dir/known_hosts.dck-host"
  mkdir -p "$ssh_dir/config.d" "$keydir"
  ktmp="$(mktemp "$known.XXXXXX")"
  # A fresh set each time: keys the host no longer sends do not linger.
  find "$keydir" -maxdepth 1 -type f -name '*.pub' -delete 2>/dev/null || true
  while read -r kind a b c d e; do
    case "$kind" in
      pub)
        case "$a" in ''|[!A-Za-z0-9]*|*[!A-Za-z0-9._-]*) dck_log "host ssh: refusing a key name"; continue ;; esac
        case "$b" in ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|sk-ssh-ed25519@openssh.com|sk-ecdsa-sha2-nistp256@openssh.com) ;; *) continue ;; esac
        case "$c" in ''|*[!A-Za-z0-9+/=]*) continue ;; esac
        printf '%s %s\n' "$b" "$c" > "$keydir/$a.pub.dck-tmp" && mv "$keydir/$a.pub.dck-tmp" "$keydir/$a.pub"
        chmod 0644 "$keydir/$a.pub"
        pubs="$pubs$a " ;;
      host) lines="$lines$a $b $c $d $e
" ;;
      kh)
        case "$a" in ''|[!A-Za-z0-9]*|*[!A-Za-z0-9.-]*) continue ;; esac
        case "$b" in ''|*[!0-9]*) continue ;; esac
        case "$c" in ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521) ;; *) continue ;; esac
        case "$d" in ''|*[!A-Za-z0-9+/=]*) continue ;; esac
        if [ "$b" = 22 ]; then printf '%s %s %s\n' "$a" "$c" "$d" >> "$ktmp"
        else printf '[%s]:%s %s %s\n' "$a" "$b" "$c" "$d" >> "$ktmp"; fi ;;
      ''|'#'*) ;;
      *) dck_log "host ssh: refusing an unknown line" ;;
    esac
  done
  tmp="$(mktemp "$frag.XXXXXX")"
  printf '# Generated by devcontainer-kit (`dck up`) from the host'"'"'s ~/.ssh/config. Do not edit.\n# Public keys only: signing goes through the host'"'"'s SSH agent.\n\n' > "$tmp"
  while read -r a b c d e; do
    [ -n "$a" ] || continue
    case "$a" in [!A-Za-z0-9_]*|*[!A-Za-z0-9._-]*) dck_log "host ssh: refusing an alias"; continue ;; esac
    case "$b" in ''|[!A-Za-z0-9]*|*[!A-Za-z0-9.-]*|127.*|localhost) dck_log "host ssh: refusing the host of $a"; continue ;; esac
    case "$c" in ''|*[!0-9]*) continue ;; esac
    [ "$c" -ge 1 ] && [ "$c" -le 65535 ] || continue
    case "$d" in -) ;; [!A-Za-z0-9_]*|*[!A-Za-z0-9._-]*) continue ;; esac
    case "$pubs" in *" $e "*) ;; *) continue ;; esac
    {
      printf 'Host %s\n  HostName %s\n  Port %s\n' "$a" "$b" "$c"
      [ "$d" = "-" ] || printf '  User %s\n' "$d"
      printf '  IdentityFile %s/%s.pub\n  IdentitiesOnly yes\n' "$keydir" "$e"
      printf '  UserKnownHostsFile %s/known_hosts %s\n\n' "$ssh_dir" "$known"
    } >> "$tmp"
    n=$((n + 1))
  done <<EOF
$lines
EOF
  chmod 0600 "$tmp" "$ktmp"; mv "$tmp" "$frag"; mv "$ktmp" "$known"
  touch "$cfg"; chmod 0600 "$cfg"
  if ! grep -qxF "Include config.d/dck-host" "$cfg"; then
    { printf 'Include config.d/dck-host\n'; cat "$cfg"; } > "$cfg.dck-tmp" && mv "$cfg.dck-tmp" "$cfg"
  fi
  _dck_chown -R "$DCK_USER:$(_dck_group)" "$ssh_dir/."  # ~/.ssh is a symlink into the state volume: chown its contents
  dck_log "host ssh: $n alias(es) written"
}

_dck_as_user() {
  if _dck_is_root && [ "$DCK_USER" != "root" ]; then
    runuser -u "$DCK_USER" -- env HOME="$DCK_HOME" "$@"
  else
    HOME="$DCK_HOME" "$@"
  fi
}

# dck_ssh_agent_access — the host's SSH agent socket (mounted at
# /run/dck/ssh-agent.sock by the template) arrives root-owned, mode 0660, so only
# root could use it. Give the container user's group access; nothing else (no
# key material is involved: the socket only lets processes ask the host agent to
# sign). Root only; a no-op when there is no socket.
dck_ssh_agent_access() {
  _dck_env
  local sock="${DCK_SSH_AGENT_SOCK:-/run/dck/ssh-agent.sock}"
  _dck_is_root || return 0
  [ -S "$sock" ] || return 0
  # A Linux host's own agent socket arrives with the host's owner: leave the
  # host file's metadata alone (OpenSSH's agent checks the peer uid anyway).
  [ "$(stat -c %u "$sock" 2>/dev/null)" = "0" ] || return 0
  chgrp "$(_dck_group)" "$sock" 2>/dev/null && chmod 0660 "$sock" 2>/dev/null \
    || dck_log "ssh agent: could not give $DCK_USER access to the host agent socket"
}

# dck_herdr_agent_link — Herdr's forwarded-agent link (~/.config/herdr/herdr.sock.agent)
# dangles when the attaching client forwarded no agent. Point a dangling one at the
# host agent dck mounts, so panes Herdr opens later get a working agent; the login
# profile does the same per shell. No-op without the mounted socket.
dck_herdr_agent_link() {
  _dck_env
  local sock="${DCK_SSH_AGENT_SOCK:-/run/dck/ssh-agent.sock}" link="$DCK_HOME/.config/herdr/herdr.sock.agent"
  [ -S "$sock" ] || return 0
  if [ -L "$link" ] && [ ! -S "$link" ]; then
    ln -sfn "$sock" "$link" && _dck_chown -h "$DCK_USER:$(_dck_group)" "$link"
    dck_log "herdr: the forwarded-agent link was dangling; it now points at the mounted host agent"
  fi
}

dck_start() {
  _dck_env
  dck_log "starting for user $DCK_USER (workspace $DCK_WORKSPACE)"
  # Per-project state volume: ssh (authorized_keys, known_hosts), gh auth,
  # Herdr config and saved machines, shell history.
  dck_persist state "$DCK_HOME/.ssh" dir || true
  _dck_chown "$DCK_USER:$(_dck_group)" "$DCK_PERSIST_ROOT/state/ssh"
  chmod 0700 "$DCK_PERSIST_ROOT/state/ssh" 2>/dev/null || true
  dck_persist state "$DCK_HOME/.config/gh" dir || true
  dck_persist state "$DCK_HOME/.config/herdr" dir || true
  # Herdr's saved SSH machines (the host, the other containers) live in its
  # client state, not its config: keep them too, or every rebuild drops them.
  # The parents are created as the user first, so Herdr can still write its
  # other state (agent detection) next to the link.
  _dck_as_user mkdir -p "$DCK_HOME/.local/state/herdr" 2>/dev/null || true
  dck_persist state "$DCK_HOME/.local/state/herdr/client" dir || true
  dck_persist state "$DCK_HOME/.bash_history" file || true
  dck_layer_persist || true
  dck_git_identity || true
  dck_ssh_agent_access || true
  dck_skills_link || true
  dck_agent_trust || true
  dck_herdr_config || true
  dck_herdr_agent_link || true
  dck_env_profile || true
  dck_sshd || true
  dck_repo_hook
  dck_log "ready"
}
