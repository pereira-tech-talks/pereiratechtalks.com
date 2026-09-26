#!/usr/bin/env bash
#
# dev.sh — start this repository's dev containers without VS Code or Cursor.
#
# The Dev Containers plugin is not the only way in: this launcher starts exactly
# the services .devcontainer/devcontainer.json declares, detached, from a plain
# terminal, and leaves the plugin path working unchanged.
#
# devcontainer.json is the single source of truth. "runServices" decides what
# starts; "remoteUser", "workspaceFolder", "mounts" and "containerEnv" decide
# how it is entered and what it is given. Add a service there and this script
# starts it with no other edit.
#
# Usage: bash dev.sh <verb> [args]     (see: bash dev.sh help)
#
# `dev.sh ssh` is the way in from the host for Herdr and anything else that
# drives this container over SSH — see docs/DEVELOPMENT_COMMANDS.md.
#
# Requires bash 3.2 (the macOS system bash) and python3.

set -euo pipefail

# --------------------------------------------------------------------------
# Basics
# --------------------------------------------------------------------------

die() { printf 'dev.sh: %s\n' "$*" >&2; exit 1; }
note() { printf '%s\n' "$*"; }
warn() { printf 'dev.sh: %s\n' "$*" >&2; }

# Resolve this script's own directory, following symlinks, so the launcher
# behaves identically from the repo root, a subdirectory, or an absolute path.
_self="${BASH_SOURCE[0]}"
while [ -L "$_self" ]; do
  _dir="$(cd -P "$(dirname "$_self")" && pwd)"
  _self="$(readlink "$_self")"
  case "$_self" in /*) ;; *) _self="$_dir/$_self" ;; esac
done
REPO_ROOT="$(cd -P "$(dirname "$_self")" && pwd)"

VERBS=" setup up down stop start restart ps logs shell exec ssh build config doctor agents ask help "

# --------------------------------------------------------------------------
# Argument parsing
# --------------------------------------------------------------------------

VERB=""
RECREATE=0
PROJECT_OVERRIDE=""
ARGS=()

while [ $# -gt 0 ]; do
  # Everything after `exec <service>` is the command to run in the container,
  # and must reach it verbatim: `dev.sh exec app pnpm run dev --host` has to
  # pass --host to pnpm, not have dev.sh reject it as its own unknown flag.
  # `ssh` is the same, from its very first argument: the whole tail is a remote
  # command line, so `dev.sh ssh herdr --version` must not lose --version.
  # dev.sh's own flags therefore go BEFORE the verb: `dev.sh --project x ssh`.
  # After ssh/ask are chosen, the whole tail belongs to that verb (including
  # flags like ask --from). exec is the same once its service name is known.
  if [ "$VERB" = "ssh" ] || [ "$VERB" = "ask" ] || { [ "$VERB" = "exec" ] && [ "${#ARGS[@]}" -ge 1 ]; }; then
    ARGS+=("$1"); shift; continue
  fi
  case "$1" in
    --recreate) RECREATE=1; shift ;;
    --project) [ $# -ge 2 ] || die "--project needs a name"; PROJECT_OVERRIDE="$2"; shift 2 ;;
    -h|--help) VERB="help"; shift ;;
    --) shift; while [ $# -gt 0 ]; do ARGS+=("$1"); shift; done ;;
    -*) die "unknown flag '$1' — run: bash dev.sh help, or put -- before arguments meant for the container" ;;
    *)
      if [ -z "$VERB" ]; then
        case "$VERBS" in
          *" $1 "*) VERB="$1" ;;
          *) die "unknown verb '$1' — run: bash dev.sh help" ;;
        esac
      else
        ARGS+=("$1")
      fi
      shift
      ;;
  esac
done

[ -n "$VERB" ] || VERB="help"

# --------------------------------------------------------------------------
# JSONC
# --------------------------------------------------------------------------

# devcontainer.json is JSONC: it carries // comments and may carry trailing
# commas. json.loads chokes on both, so strip them first — and strip them while
# tracking string literals, or the first "https://example.com" in the file is
# read as the start of a comment and the rest of the line disappears.
PY_JSONC=$(cat <<'PY'
import json, os, re, sys


def _scan(s, on_comma=None):
    """Walk s outside string literals. Comments are dropped; on_comma, when
    given, decides whether a comma survives."""
    out = []
    i = 0
    n = len(s)
    instr = False
    while i < n:
        c = s[i]
        if instr:
            out.append(c)
            if c == '\\' and i + 1 < n:
                out.append(s[i + 1])
                i += 2
                continue
            if c == '"':
                instr = False
            i += 1
            continue
        if c == '"':
            instr = True
            out.append(c)
            i += 1
            continue
        if c == '/' and i + 1 < n and s[i + 1] == '/':
            while i < n and s[i] != '\n':
                i += 1
            continue
        if c == '/' and i + 1 < n and s[i + 1] == '*':
            i += 2
            while i + 1 < n and not (s[i] == '*' and s[i + 1] == '/'):
                i += 1
            i += 2
            continue
        if c == ',' and on_comma is not None and not on_comma(s, i):
            i += 1
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def _comma_kept(s, i):
    j = i + 1
    n = len(s)
    while j < n:
        if s[j] in ' \t\r\n':
            j += 1
        elif s[j] == '/' and j + 1 < n and s[j + 1] == '/':
            while j < n and s[j] != '\n':
                j += 1
        elif s[j] == '/' and j + 1 < n and s[j + 1] == '*':
            j += 2
            while j + 1 < n and not (s[j] == '*' and s[j + 1] == '/'):
                j += 1
            j += 2
        else:
            break
    return not (j < n and s[j] in '}]')


def strip_jsonc(s):
    return _scan(s, _comma_kept)


def load_jsonc(path):
    with open(path) as fh:
        return json.loads(strip_jsonc(fh.read()))
PY
)

py() {
  local body="$1"; shift
  python3 -c "$PY_JSONC

$body" "$@"
}

# --------------------------------------------------------------------------
# devcontainer.json resolution
# --------------------------------------------------------------------------

# Prints KEY=VALUE lines. Never eval'd: the caller reads them with IFS.
read_devcontainer() {
  py '
root = sys.argv[1]
active = os.path.join(root, ".devcontainer", "devcontainer.json")
tmpl = os.path.join(root, ".devcontainer_example", "devcontainer.json")
if os.path.isfile(active):
    path, source = active, "active"
elif os.path.isfile(tmpl):
    path, source = tmpl, "example"
else:
    sys.stderr.write("no devcontainer.json under .devcontainer/ or .devcontainer_example/\n")
    raise SystemExit(2)

try:
    data = load_jsonc(path)
except Exception as exc:                                    # noqa: BLE001
    sys.stderr.write("cannot parse %s: %s\n" % (path, exc))
    raise SystemExit(2)

cf = data.get("dockerComposeFile")
if isinstance(cf, str):
    cf = [cf]
cf = [c for c in (cf or []) if isinstance(c, str)]
if not cf:
    sys.stderr.write("%s declares no dockerComposeFile\n" % path)
    raise SystemExit(2)
base = os.path.dirname(path)
files = [os.path.normpath(os.path.join(base, c)) for c in cf]

service = data.get("service") or ""
# runServices is what the plugin starts. Fall back to the single service key
# only when runServices is absent -- never to "every service in the compose
# file", which would drag in on-demand containers nobody asked for.
run = data.get("runServices") or ([service] if service else [])

print("DC_FILE=%s" % path)
print("DC_SOURCE=%s" % source)
for f in files:
    print("DC_COMPOSE_FILE=%s" % f)
print("DC_SERVICE=%s" % service)
print("DC_RUNSERVICES=%s" % " ".join(run))
print("DC_USER=%s" % (data.get("remoteUser") or ""))
print("DC_WORKSPACE=%s" % (data.get("workspaceFolder") or ""))
print("DC_SHUTDOWN=%s" % (data.get("shutdownAction") or ""))
print("DC_MOUNTS=%d" % len(data.get("mounts") or []))
print("DC_ENVS=%d" % len(data.get("containerEnv") or {}))
' "$1"
}

load_context() {
  local line k v
  DC_FILE=""; DC_SOURCE=""; DC_SERVICE=""; DC_RUNSERVICES=""
  DC_USER=""; DC_WORKSPACE=""; DC_SHUTDOWN=""; DC_MOUNTS="0"; DC_ENVS="0"
  DC_COMPOSE_FILES=()
  while IFS= read -r line; do
    k="${line%%=*}"; v="${line#*=}"
    case "$k" in
      DC_FILE) DC_FILE="$v" ;;
      DC_SOURCE) DC_SOURCE="$v" ;;
      DC_COMPOSE_FILE) DC_COMPOSE_FILES+=("$v") ;;
      DC_SERVICE) DC_SERVICE="$v" ;;
      DC_RUNSERVICES) DC_RUNSERVICES="$v" ;;
      DC_USER) DC_USER="$v" ;;
      DC_WORKSPACE) DC_WORKSPACE="$v" ;;
      DC_SHUTDOWN) DC_SHUTDOWN="$v" ;;
      DC_MOUNTS) DC_MOUNTS="$v" ;;
      DC_ENVS) DC_ENVS="$v" ;;
    esac
  done < <(read_devcontainer "$REPO_ROOT")
  [ "${#DC_COMPOSE_FILES[@]}" -gt 0 ] || die "could not resolve the devcontainer configuration in $REPO_ROOT"
  local f
  for f in "${DC_COMPOSE_FILES[@]}"; do
    [ -f "$f" ] || die "compose file not found: $f"
  done
  DC_COMPOSE="${DC_COMPOSE_FILES[0]}"
  COMPOSE_DIR="$(cd -P "$(dirname "$DC_COMPOSE")" && pwd)"
  # The plugin injects mounts/containerEnv through a generated overlay. Plain
  # compose does not, so we have to reproduce it -- but only when there is
  # something to reproduce.
  if [ "$DC_MOUNTS" != "0" ] || [ "$DC_ENVS" != "0" ]; then
    DC_HAS_OVERLAY=1
  else
    DC_HAS_OVERLAY=0
  fi
}

# --------------------------------------------------------------------------
# Compose project name
# --------------------------------------------------------------------------

resolve_project() {
  PROJECT=""; PROJECT_FROM=""
  if [ -n "$PROJECT_OVERRIDE" ]; then
    PROJECT="$PROJECT_OVERRIDE"; PROJECT_FROM="--project flag"; return 0
  fi
  if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
    PROJECT="$COMPOSE_PROJECT_NAME"; PROJECT_FROM="COMPOSE_PROJECT_NAME in the environment"; return 0
  fi
  if [ -f "$COMPOSE_DIR/.env" ]; then
    local v
    v="$(sed -n 's/^[[:space:]]*COMPOSE_PROJECT_NAME[[:space:]]*=[[:space:]]*\(.*\)$/\1/p' "$COMPOSE_DIR/.env" | tail -1)"
    v="${v%\"}"; v="${v#\"}"
    if [ -n "$v" ]; then
      PROJECT="$v"; PROJECT_FROM="COMPOSE_PROJECT_NAME in ${COMPOSE_DIR#"$REPO_ROOT"/}/.env"; return 0
    fi
  fi
  local n
  n="$(sed -n 's/^name:[[:space:]]*\([A-Za-z0-9_.-]*\).*$/\1/p' "$DC_COMPOSE" | head -1)"
  if [ -n "$n" ]; then
    PROJECT="$n"; PROJECT_FROM="top-level name: in the compose file"; return 0
  fi
  # Never the directory default. Compose would name the project after
  # docker/local/, which is not what the plugin used, so we would quietly build
  # a second, parallel set of containers next to the real ones and then fight
  # them over ports 8888 and 22030.
  die "cannot resolve the compose project name — add a top-level 'name:' to ${DC_COMPOSE#"$REPO_ROOT"/}, set COMPOSE_PROJECT_NAME, or pass --project"
}

# --------------------------------------------------------------------------
# Compose binary and invocation
# --------------------------------------------------------------------------

# Resolved with command -v, never by running `docker compose version`: that call
# costs well over 100 ms and every verb pays it.
resolve_compose_bin() {
  [ -n "${COMPOSE_BIN:-}" ] && return 0
  if command -v docker >/dev/null 2>&1; then
    COMPOSE_BIN="docker"; COMPOSE_SUB="compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_BIN="docker-compose"; COMPOSE_SUB=""
  else
    die "neither 'docker' nor 'docker-compose' is on PATH — install Docker Desktop"
  fi
}

# Pure: computes the path, creates nothing. `config` and `doctor` must be able
# to name the overlay without bringing it into existence.
overlay_path() {
  local base="${TMPDIR:-/tmp}"
  printf '%s/dev-sh-%s/%s-overlay.yml' "${base%/}" "$(id -u)" "$(basename "$REPO_ROOT")"
}

# Creates the directory the overlay lives in. Separate from overlay_path so that
# the read-only verbs can never reach it.
ensure_overlay_dir() {
  local d
  d="$(dirname "$(overlay_path)")"
  # Created with the mode already applied, never created-then-chmod'd, and never
  # reused unless we own it. The name is predictable, and while TMPDIR is
  # per-user on macOS the /tmp fallback is world-writable, so another local
  # account can plant this directory first. Testing -d and moving on would hand
  # them the overlay -- which names mounts and environment -- plus a symlink
  # race on the file we then write inside it.
  if ! (umask 077 && mkdir -p "$d") 2>/dev/null; then
    die "could not create $d"
  fi
  if [ -L "$d" ] || [ ! -d "$d" ] || [ ! -O "$d" ]; then
    die "$d is not a directory you own — refusing to write the compose overlay there.
       Remove it, or point TMPDIR somewhere private."
  fi
  chmod 700 "$d"
}

# Reproduce the devcontainer's own `mounts` and `containerEnv`. The Dev
# Containers plugin injects these through a generated overlay; plain compose
# omits them silently, so the container comes up looking healthy while named
# volumes are unmounted and environment variables are unset. Written outside the
# repository so no working tree gains an untracked file.
write_overlay() {
  [ "$DC_HAS_OVERLAY" = "1" ] || return 0
  ensure_overlay_dir
  py '
src, service, project, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

d = load_jsonc(src)
mounts, env = d.get("mounts") or [], d.get("containerEnv") or {}


def parse(m):
    if isinstance(m, dict):
        return dict(m)
    if not isinstance(m, str):
        return {}
    return dict(p.split("=", 1) for p in m.split(",") if "=" in p)


binds, vols, decls, order = [], [], {}, []
for raw in mounts:
    m = parse(raw)
    source, target = m.get("source"), m.get("target")
    if not source or not target:
        continue
    suffix = ":ro" if str(m.get("readonly", "")).lower() in ("true", "1") else ""
    if m.get("type") == "bind":
        binds.append("      - %s:%s%s" % (source, target, suffix))
        continue
    if m.get("type") != "volume":
        continue
    # The plugin passes source= straight through as a compose volume SHORT
    # name, and compose then prefixes it with the project -- which is why a
    # real container shows <project>_<source>. If devcontainer.json already
    # spells the qualified name, declaring it short again yields
    # <project>_<project>_<source>: a second, empty volume mounted next to the
    # real one, which presents as "my CLI state keeps resetting itself".
    # Already-qualified sources are therefore declared external, by name.
    if source not in decls:
        order.append(source)
        decls[source] = source if source.startswith(project + "_") else None
    vols.append("      - %s:%s%s" % (source, target, suffix))

lines = [
    "# Generated by dev.sh from %s — do not edit." % os.path.basename(src),
    "# Reproduces the devcontainer mounts/containerEnv that plain compose omits.",
    "services:",
    "  %s:" % service,
]
if env:
    lines.append("    environment:")
    for k, v in env.items():
        lines.append("      %s: %s" % (k, json.dumps(str(v))))
if vols or binds:
    lines.append("    volumes:")
    lines.extend(binds)
    lines.extend(vols)
if order:
    lines.append("volumes:")
    for short in order:
        external = decls[short]
        if external is None:
            lines.append("  %s: {}" % short)
        else:
            lines.append("  %s:" % short)
            lines.append("    external: true")
            lines.append("    name: %s" % external)

fd = os.open(out, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as fh:
    fh.write("\n".join(lines) + "\n")
' "$DC_FILE" "$DC_SERVICE" "$PROJECT" "$(overlay_path)"
}

compose_args() {
  local f
  COMPOSE_ARGS=()
  for f in "${DC_COMPOSE_FILES[@]}"; do
    COMPOSE_ARGS+=(-f "$f")
  done
  # Included only when it already exists: the read-only verbs must not conjure
  # it, and a stale one is better than none for `ps`/`logs`.
  if [ "$DC_HAS_OVERLAY" = "1" ] && [ -f "$(overlay_path)" ]; then
    COMPOSE_ARGS+=(-f "$(overlay_path)")
  fi
}

# NOTE: --remove-orphans is deliberately never passed, and must not be added.
# It deletes every container in the project that the CURRENT compose file does
# not declare — which includes anything an older branch's compose file started
# and someone is still using, and any on-demand service added to this file
# later but left out of runServices. Compose prints a warning recommending the
# flag; in this project that warning is an instruction to destroy containers
# the user asked for. `dev.sh down` removes services by name instead.
dc() {
  resolve_compose_bin
  compose_args
  if [ -n "$COMPOSE_SUB" ]; then
    "$COMPOSE_BIN" "$COMPOSE_SUB" -p "$PROJECT" "${COMPOSE_ARGS[@]}" "$@"
  else
    "$COMPOSE_BIN" -p "$PROJECT" "${COMPOSE_ARGS[@]}" "$@"
  fi
}

# --------------------------------------------------------------------------
# Environment files and external networks
# --------------------------------------------------------------------------

# Octal mode of a file, or "" if it cannot be determined. BSD stat and GNU stat
# disagree on every flag, so both are tried; `find -perm +077` is not an option
# because GNU find spells the same test `-perm /077` and errors on the BSD form.
file_mode() {
  stat -f '%Lp' "$1" 2>/dev/null || stat -c '%a' "$1" 2>/dev/null || printf ''
}

# True when group or other can reach the file at all.
group_or_other_readable() {
  local m
  m="$(file_mode "$1")"
  [ -n "$m" ] || return 1
  [ "$(( 8#$m & 8#077 ))" -ne 0 ]
}

env_examples() {
  [ -d "$COMPOSE_DIR" ] || return 0
  find "$COMPOSE_DIR" -type f -name '.env*.example' 2>/dev/null | sort
}

external_networks() {
  py '
txt = open(sys.argv[1]).read()
m = re.search(r"^networks:\s*$", txt, re.M)
if not m:
    raise SystemExit(0)
body = txt[m.end():]
end = re.search(r"^\S", body, re.M)
body = body[:end.start()] if end else body
if "external" not in body:
    raise SystemExit(0)
for name in re.findall(r"^\s*name:\s*([A-Za-z0-9_.-]+)\s*$", body, re.M):
    print(name)
' "$DC_COMPOSE"
}

# Host paths the compose file bind-mounts through ${HOME}. When one is missing,
# Docker silently creates a DIRECTORY at that path on the host and mounts that,
# so ~/.gitconfig becomes a folder and git inside the container reads nothing.
host_binds() {
  local f
  for f in "${DC_COMPOSE_FILES[@]}"; do
    sed -n 's/^[[:space:]]*-[[:space:]]*\${HOME}\(\/[^:]*\):.*$/\1/p' "$f"
  done | sort -u
}

# Detect only. Never creates. Runs before the verbs that start containers.
fast_check() {
  local missing="" f target net
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    target="${f%.example}"
    [ -f "$target" ] || missing="${missing}${missing:+, }${target#"$REPO_ROOT"/}"
  done < <(env_examples)
  if [ -n "$missing" ]; then
    die "local environment not ready (missing $missing) — run: bash dev.sh setup"
  fi
  while IFS= read -r net; do
    [ -n "$net" ] || continue
    if ! docker network inspect "$net" >/dev/null 2>&1; then
      die "docker network '$net' is missing — run: bash dev.sh setup"
    fi
  done < <(external_networks)
  local b
  while IFS= read -r b; do
    [ -n "$b" ] || continue
    [ -e "$HOME$b" ] || warn "\$HOME$b does not exist — Docker will create a directory there and mount it. Create the file first if that is not what you want."
  done < <(host_binds)
}

# --------------------------------------------------------------------------
# Verbs
# --------------------------------------------------------------------------

selected_services() {
  local s
  SERVICES=()
  if [ "${#ARGS[@]}" -gt 0 ]; then
    SERVICES=("${ARGS[@]}")
  else
    for s in $DC_RUNSERVICES; do
      SERVICES+=("$s")
    done
  fi
  [ "${#SERVICES[@]}" -gt 0 ] || die "no services to act on — ${DC_FILE#"$REPO_ROOT"/} declares neither runServices nor service"
}

cmd_setup() {
  local created=0 f target net

  while IFS= read -r f; do
    [ -n "$f" ] || continue
    target="${f%.example}"
    if [ ! -f "$target" ]; then
      # Created empty at 0600 and only then filled. `cp` would leave the file at
      # the umask default -- typically 0644, readable by every account on the
      # machine -- and this is the file the developer then pastes API keys into.
      # Narrowing it afterwards is too late: the secret was already exposed.
      if ! (umask 077 && : > "$target"); then
        die "could not create $target"
      fi
      cat "$f" > "$target"
      note "created ${target#"$REPO_ROOT"/} (0600)"
      created=$((created + 1))
    elif group_or_other_readable "$target"; then
      # An existing file that group or other can reach. Narrowing it now cannot
      # un-expose a secret that has already been sitting there readable, but
      # leaving it open guarantees the next one is exposed too. Announced, never
      # silent: the developer should know their key was world-readable.
      chmod 600 "$target" || die "could not restrict $target to 0600"
      note "narrowed ${target#"$REPO_ROOT"/} to 0600 (it was readable by other accounts on this machine)"
      created=$((created + 1))
    fi
  done < <(env_examples)

  while IFS= read -r net; do
    [ -n "$net" ] || continue
    if docker network inspect "$net" >/dev/null 2>&1; then
      note "network $net already present"
    else
      docker network create "$net" >/dev/null
      note "created network $net"
      created=$((created + 1))
    fi
  done < <(external_networks)

  if [ ! -d "$REPO_ROOT/.devcontainer" ] && [ -d "$REPO_ROOT/.devcontainer_example" ]; then
    mkdir -p "$REPO_ROOT/.devcontainer"
    cp -R "$REPO_ROOT/.devcontainer_example/." "$REPO_ROOT/.devcontainer/"
    note "created .devcontainer/ from .devcontainer_example/"
    created=$((created + 1))
    load_context   # the active file now exists; re-read from it
  fi
  if [ ! -d "$REPO_ROOT/.vscode" ] && [ -d "$REPO_ROOT/.vscode_example" ]; then
    mkdir -p "$REPO_ROOT/.vscode"
    cp -R "$REPO_ROOT/.vscode_example/." "$REPO_ROOT/.vscode/"
    note "created .vscode/ from .vscode_example/"
    created=$((created + 1))
  fi

  if ensure_shutdown_action; then
    created=$((created + 1))
  fi

  if [ "$created" -eq 0 ]; then
    note "setup: everything was already in place"
  else
    note "setup: done"
  fi
}

# The plugin stops the containers when the editor window closes, which is the
# opposite of what a terminal user wants: they start a stack and expect to find
# it running tomorrow. "none" is an additive key of the Dev Container spec, so
# the plugin path keeps working -- it just stops tearing the stack down.
ensure_shutdown_action() {
  local f="$REPO_ROOT/.devcontainer/devcontainer.json"
  [ -f "$f" ] || return 1
  local out
  out="$(py '
path = sys.argv[1]
src = open(path).read()

if "shutdownAction" in strip_jsonc(src):
    raise SystemExit(1)                       # already decided; leave it alone

commented = re.search(r"^([ \t]*)//[ \t]*(\"shutdownAction\"[^\n]*)$", src, re.M)
if commented:
    new = src[:commented.start()] + commented.group(1) + commented.group(2) + src[commented.end():]
else:
    anchor = re.search(r"^([ \t]*)\"(runServices|service)\"[^\n]*\n", src, re.M)
    if not anchor:
        raise SystemExit(1)
    new = src[:anchor.end()] + "%s\"shutdownAction\": \"none\",\n" % anchor.group(1) + src[anchor.end():]

try:
    json.loads(strip_jsonc(new))
except Exception:                             # noqa: BLE001
    raise SystemExit(1)                       # refuse to write something unparsable

with open(path + ".bak", "w") as fh:
    fh.write(src)
tmp = path + ".tmp"
with open(tmp, "w") as fh:
    fh.write(new)
os.replace(tmp, path)
print("set \"shutdownAction\": \"none\" in .devcontainer/devcontainer.json (previous copy: devcontainer.json.bak)")
print("  the stack now survives closing the editor window; dev.sh down stops it")
' "$f")" || return 1
  [ -n "$out" ] && note "$out"
  DC_SHUTDOWN="none"
  return 0
}

cmd_up() {
  fast_check
  write_overlay
  selected_services
  note "starting ${SERVICES[*]} (project $PROJECT)"
  if [ "$RECREATE" -eq 1 ]; then
    dc up -d --force-recreate "${SERVICES[@]}"
  else
    # --no-recreate by default, so a second `up` is a no-op instead of a
    # replacement. A container the plugin created carries the plugin's own
    # generated overlay files, so its config hash differs from ours and a plain
    # `up` would silently recreate it, dropping whatever the plugin added.
    # --recreate is how you ask for compose changes to be applied on purpose.
    dc up -d --no-recreate "${SERVICES[@]}"
    note "existing containers were left as they are; use --recreate to apply compose changes"
  fi
}

cmd_down() {
  selected_services
  # Scoped to this repository's declared services. Never `compose down`, which
  # acts on the whole project and would take out anything else sharing it.
  note "stopping and removing ${SERVICES[*]} (project $PROJECT)"
  dc rm -sf "${SERVICES[@]}"
  note "named volumes were kept; list them with: docker volume ls --filter name=${PROJECT}_"
}

cmd_simple() {
  local verb="$1"
  # `stop` deliberately skips fast_check. start/restart bring containers up and
  # need a complete environment; refusing to STOP a running stack because an
  # env file went missing would strand it with no way out but raw compose.
  [ "$verb" = "stop" ] || fast_check
  write_overlay
  selected_services
  dc "$verb" "${SERVICES[@]}"
}

cmd_ps() {
  selected_services
  dc ps "${SERVICES[@]}"
}

cmd_logs() {
  selected_services
  dc logs -f "${SERVICES[@]}"
}

# remoteUser and workspaceFolder describe the devcontainer's MAIN service only.
# A backing service has no such user, and passing it there fails with
# "unable to find user node in /etc/passwd".
exec_opts() {
  local service="$1"
  EXEC_OPTS=()
  [ "$service" = "$DC_SERVICE" ] || return 0
  if [ -n "$DC_USER" ]; then
    # docker exec inherits PID 1's environment, including HOME=/root, so a
    # non-root shell needs these or the user's own profile never loads.
    EXEC_OPTS+=(--user "$DC_USER" -e "HOME=/home/$DC_USER" -e "USER=$DC_USER" -e "LOGNAME=$DC_USER")
  fi
  [ -n "$DC_WORKSPACE" ] && EXEC_OPTS+=(-w "$DC_WORKSPACE")
  return 0
}

cmd_shell() {
  local service="${ARGS[0]:-$DC_SERVICE}"
  exec_opts "$service"
  # A LOGIN shell, deliberately. A non-login shell reads neither /etc/profile.d
  # nor ~/.bash_profile, and this image puts its PATH ordering in
  # /etc/profile.d/00-container-node-first.sh, the compose environment in
  # /etc/profile.d/01-container-env.sh, and its command wrappers in ~/.bashrc
  # (reached via ~/.bash_profile). Drop the -l and node resolves to
  # whatever the editor server prepended, while the custom commands vanish.
  # Which shell exists is probed rather than discovered by letting `bash -l`
  # fail and retrying with `sh -l`: that pattern reports every genuine failure
  # twice (a missing workspaceFolder, a remoteUser absent from passwd) and
  # blames the wrong shell for it.
  local shellbin=sh
  # </dev/null matters: without it the probe inherits this script's stdin and
  # consumes it, so `echo cmd | dev.sh shell` silently runs nothing.
  if dc exec -T "$service" sh -c 'command -v bash' </dev/null >/dev/null 2>&1; then
    shellbin=bash
  fi
  dc exec ${EXEC_OPTS[@]+"${EXEC_OPTS[@]}"} "$service" "$shellbin" -l
}

cmd_exec() {
  [ "${#ARGS[@]}" -ge 2 ] || die "exec needs a service and a command: bash dev.sh exec <service> <cmd...>"
  local service="${ARGS[0]}"
  local rest=("${ARGS[@]:1}")
  exec_opts "$service"
  dc exec ${EXEC_OPTS[@]+"${EXEC_OPTS[@]}"} "$service" "${rest[@]}"
}

# --------------------------------------------------------------------------
# SSH into the dev container
# --------------------------------------------------------------------------

# The port sshd listens on INSIDE the container. entrypoint.sh reads
# SSH_SERVER_PORT from the env file and falls back to 22030, so this has to
# resolve it the same way or the two disagree the moment someone changes it.
# Commented lines are skipped: the shipped .env.example documents the variable
# with a leading '#', and reading that as a value would pin the wrong port.
ssh_container_port() {
  local f target v
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    target="${f%.example}"
    [ -f "$target" ] || continue
    v="$(sed -n 's/^[[:space:]]*SSH_SERVER_PORT[[:space:]]*=[[:space:]]*\([0-9][0-9]*\).*$/\1/p' "$target" | tail -1)"
    [ -n "$v" ] && { printf '%s' "$v"; return 0; }
  done < <(env_examples)
  printf '22030'
}

# The host port published for it. Asked of the running container first, because
# that is the only source that cannot be stale; the compose file is the fallback
# for when nothing is running yet.
compose_published_port() {
  local want="$1" f
  for f in "${DC_COMPOSE_FILES[@]}"; do
    sed -n "s/^[[:space:]]*-[[:space:]]*['\"]\{0,1\}\([0-9.]*:\)\{0,1\}\([0-9][0-9]*\):${want}['\"]\{0,1\}[[:space:]]*$/\2/p" "$f" | tail -1
  done | tail -1
}

resolve_ssh_ports() {
  SSH_CPORT="$(ssh_container_port)"
  local mapped
  mapped="$(dc port "$DC_SERVICE" "$SSH_CPORT" 2>/dev/null | tail -1 || true)"
  if [ -n "$mapped" ]; then
    SSH_HPORT="${mapped##*:}"
    SSH_PORT_FROM="the running container"
  else
    SSH_HPORT="$(compose_published_port "$SSH_CPORT")"
    SSH_PORT_FROM="the compose file"
  fi
}

# `ssh`, not `docker exec`. The difference is the whole point: docker exec hands
# the session PID 1's environment, so a container whose SSH wiring is broken
# still looks perfectly healthy through it. sshd starts every session clean,
# which is exactly what Herdr gets — so this is the only honest way to check
# that what Herdr will see actually works.
cmd_ssh() {
  command -v ssh >/dev/null 2>&1 || die "ssh is not on PATH"
  resolve_ssh_ports
  [ -n "$SSH_HPORT" ] || die "no host port is published for container port $SSH_CPORT — check the ports: list in ${DC_COMPOSE#"$REPO_ROOT"/}"

  local running
  running="$(docker ps --filter "label=com.docker.compose.project=$PROJECT" \
                       --filter "label=com.docker.compose.service=$DC_SERVICE" \
                       --format '{{.Names}}' 2>/dev/null || true)"
  [ -n "$running" ] || die "$DC_SERVICE is not running — run: bash dev.sh up"

  local user="${DC_USER:-node}"
  # accept-new, not `no`: a first connection to a container that has just been
  # created should not stop to ask, but a host key that CHANGES must still be
  # refused. That is the case worth catching — the identity is meant to survive
  # rebuilds in the sshd_data volume, so a mismatch means something is wrong.
  ssh -p "$SSH_HPORT" \
      -o StrictHostKeyChecking=accept-new \
      "${user}@127.0.0.1" ${ARGS[@]+"${ARGS[@]}"}
}

cmd_build() {
  fast_check
  write_overlay
  selected_services
  dc build "${SERVICES[@]}"
}

cmd_config() {
  local f
  note "repository       $REPO_ROOT"
  note "devcontainer     ${DC_FILE#"$REPO_ROOT"/} ($DC_SOURCE)"
  for f in "${DC_COMPOSE_FILES[@]}"; do
    note "compose file     ${f#"$REPO_ROOT"/}"
  done
  note "compose project  $PROJECT (from $PROJECT_FROM)"
  note "main service     ${DC_SERVICE:-<unset>}"
  note "runServices      ${DC_RUNSERVICES:-<unset>}"
  note "remoteUser       ${DC_USER:-<unset>}"
  note "workspaceFolder  ${DC_WORKSPACE:-<unset>}"
  note "shutdownAction   ${DC_SHUTDOWN:-<unset>}"
  local nets
  nets="$(external_networks | tr '\n' ' ')"
  note "external nets    ${nets:-<none>}"
  if [ "$DC_HAS_OVERLAY" = "1" ]; then
    note "overlay          $(overlay_path)"
    note "                 $DC_MOUNTS mount(s), $DC_ENVS containerEnv var(s); written on the next up/build"
  else
    note "overlay          <none needed> (devcontainer.json declares no mounts or containerEnv)"
  fi
}

cmd_doctor() {
  resolve_compose_bin
  if [ -n "$COMPOSE_SUB" ]; then
    note "compose          $("$COMPOSE_BIN" "$COMPOSE_SUB" version 2>/dev/null | head -1)"
  else
    note "compose          $("$COMPOSE_BIN" --version 2>/dev/null | head -1)"
  fi
  note "docker daemon    $(docker info --format '{{.ServerVersion}}' 2>/dev/null || echo 'not reachable')"
  note "python3          $(python3 --version 2>&1 | head -1)"
  cmd_config

  local f target net state b
  note "--- environment files"
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    target="${f%.example}"
    if [ ! -f "$target" ]; then
      note "  ${target#"$REPO_ROOT"/}: MISSING — run: bash dev.sh setup"
    elif group_or_other_readable "$target"; then
      note "  ${target#"$REPO_ROOT"/}: present, but mode 0$(file_mode "$target") — API keys here are readable by other accounts. Fix with: bash dev.sh setup"
    else
      note "  ${target#"$REPO_ROOT"/}: present (0600)"
    fi
  done < <(env_examples)

  note "--- external networks"
  state=""
  while IFS= read -r net; do
    [ -n "$net" ] || continue
    state="present"
    docker network inspect "$net" >/dev/null 2>&1 || state="MISSING"
    note "  $net: $state"
  done < <(external_networks)
  [ -n "$state" ] || note "  <none declared>"

  note "--- host bind sources"
  state=""
  while IFS= read -r b; do
    [ -n "$b" ] || continue
    state="seen"
    if [ -e "$HOME$b" ]; then
      note "  \$HOME$b: present"
    else
      note "  \$HOME$b: MISSING — Docker will mount an empty directory in its place"
    fi
  done < <(host_binds)
  [ -n "$state" ] || note "  <none>"

  note "--- declared environment keys (names only, never values)"
  local line key val
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    target="${f%.example}"
    [ -f "$target" ] || continue
    while IFS= read -r line; do
      case "$line" in \#*|'') continue ;; esac
      case "$line" in *=*) ;; *) continue ;; esac
      key="${line%%=*}"; val="${line#*=}"
      note "  ${key}: $([ -n "$val" ] && echo set || echo unset)"
    done < "$target"
  done < <(env_examples)

  note "--- ssh (how Herdr reaches this container)"
  resolve_ssh_ports
  note "  container port   ${SSH_CPORT}"
  note "  host port        ${SSH_HPORT:-<none published>} (from $SSH_PORT_FROM)"
  if [ -n "$SSH_HPORT" ]; then
    note "  connect          bash dev.sh ssh    —    or: ssh -p ${SSH_HPORT} ${DC_USER:-node}@127.0.0.1"
    # Host key only. No login is attempted: doctor must not prompt, and a
    # refused key is a finding to report, not an interactive detour.
    if command -v ssh-keyscan >/dev/null 2>&1 \
       && ssh-keyscan -T 3 -p "$SSH_HPORT" 127.0.0.1 2>/dev/null | grep -q .; then
      note "  sshd             answering on 127.0.0.1:${SSH_HPORT}"
    else
      note "  sshd             NOT answering on 127.0.0.1:${SSH_HPORT} — is the container up?"
    fi
  fi

  note "--- containers"
  local s names created
  for s in $DC_RUNSERVICES; do
    # Captured first, then matched. Piping into `grep -q` under `set -o pipefail`
    # fails the pipeline: grep closes the pipe on its first match, docker dies of
    # SIGPIPE, and the status is non-zero although everything worked.
    names="$(docker ps -a --filter "label=com.docker.compose.project=$PROJECT" \
                        --filter "label=com.docker.compose.service=$s" \
                        --format '{{.Names}}\t{{.Status}}' 2>/dev/null || true)"
    if [ -z "$names" ]; then
      note "  $s: not created"
      continue
    fi
    note "  $s: $names"
    # Which compose files the RUNNING container was created from. If this names
    # a path under the editor's temp directory, it was started by the plugin; if
    # it names only the repository's compose file, dev.sh started it. That is
    # the fastest way to see whether the two paths agree.
    created="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' \
                 "$(printf '%s' "$names" | head -1 | cut -f1)" 2>/dev/null || true)"
    [ -n "$created" ] && note "      created from: $created"
  done
}

# --------------------------------------------------------------------------
# Herdr mesh — list agents and ask with a reply grant
# --------------------------------------------------------------------------

# Derive container aliases from the live host workspace peers file on every
# call: same Host and Port, HostName swapped for the Docker gateway.
HERDR_WORKSPACE_PEERS_REL="config.d/herdr-workspace-peers"
herdr_sync_workspace_peers() {
  local src=""
  if [ -f "${HOME}/.ssh_host/config.d/herdr-workspaces" ]; then
    src="${HOME}/.ssh_host/config.d/herdr-workspaces"
  elif [ -f "${HOME}/.ssh_host/config.d/dailybot-workspaces" ]; then
    src="${HOME}/.ssh_host/config.d/dailybot-workspaces"
  elif [ -f "${HOME}/.ssh/config.d/herdr-workspaces" ]; then
    src="${HOME}/.ssh/config.d/herdr-workspaces"
  elif [ -f "${HOME}/.ssh/config.d/dailybot-workspaces" ]; then
    src="${HOME}/.ssh/config.d/dailybot-workspaces"
  else
    return 0
  fi
  local dest="${HOME}/.ssh/${HERDR_WORKSPACE_PEERS_REL}"
  local ssh_config="${HOME}/.ssh/config"
  local include_line="Include ~/.ssh/${HERDR_WORKSPACE_PEERS_REL}"
  mkdir -p "$(dirname "$dest")"
  local tmp
  tmp="$(mktemp "${dest}.XXXXXX")"
  awk '
    function flush() {
      if (host != "" && port != "" && user != "") {
        printf "Host %s\n  HostName host.docker.internal\n  Port %s\n  User %s\n  StrictHostKeyChecking accept-new\n\n", host, port, user
      }
      host=""; port=""; user=""
    }
    BEGIN { print "# Generated by dev.sh from host workspace peers. Do not edit.\n" }
    /^Host / { flush(); if ($2 ~ /^[A-Za-z0-9._-]+$/ && NF == 2) host=$2; next }
    /^[[:space:]]*Port / { if ($2 ~ /^22[0-9][0-9][0-9]$/) port=$2; next }
    /^[[:space:]]*User / { if ($2 ~ /^[a-z_][a-z0-9_-]*$/) user=$2; next }
    END { flush() }
  ' "$src" > "$tmp"
  chmod 600 "$tmp"
  mv "$tmp" "$dest"
  touch "$ssh_config"
  if ! grep -qxF "$include_line" "$ssh_config"; then
    tmp="$(mktemp "${ssh_config}.XXXXXX")"
    printf '%s\n' "$include_line" | cat - "$ssh_config" > "$tmp"
    chmod 600 "$tmp"
    mv "$tmp" "$ssh_config"
  fi
}

# Trust ED25519 host keys for peer ports before asking for agents.
herdr_trust_peer_keys() {
  local peers=""
  if [ -f "${HOME}/.ssh_host/config.d/herdr-peers" ]; then
    peers="${HOME}/.ssh_host/config.d/herdr-peers"
  elif [ -f "${HOME}/.ssh_host/config.d/dailybot-peers" ]; then
    peers="${HOME}/.ssh_host/config.d/dailybot-peers"
  elif [ -f "${HOME}/.ssh/config.d/herdr-peers" ]; then
    peers="${HOME}/.ssh/config.d/herdr-peers"
  elif [ -f "${HOME}/.ssh/config.d/dailybot-peers" ]; then
    peers="${HOME}/.ssh/config.d/dailybot-peers"
  fi
  local workspace_peers="${HOME}/.ssh/${HERDR_WORKSPACE_PEERS_REL}"
  local known="${HOME}/.ssh/known_hosts"
  local sources=()
  [ -n "$peers" ] && [ -f "$peers" ] && sources+=("$peers")
  [ -f "$workspace_peers" ] && sources+=("$workspace_peers")
  [ "${#sources[@]}" -gt 0 ] || return 0
  mkdir -p "${HOME}/.ssh"
  touch "$known"
  awk '
    /^Host / { host=$2; port="" }
    /^[[:space:]]*Port / && host != "" { port=$2 }
    host != "" && port != "" {
      printf "%s %s\n", host, port
      host=""; port=""
    }
  ' "${sources[@]}" | while read -r peer_host peer_port; do
    case "${peer_port}" in
      ''|*[!0-9]*) continue ;;
      220[0-9][0-9]|22[4-9][0-9][0-9]) ;;
      *) continue ;;
    esac
    if ssh-keygen -F "[host.docker.internal]:${peer_port}" -f "$known" 2>/dev/null \
      | grep -q 'ssh-ed25519'; then
      continue
    fi
    if ! ssh-keyscan -T 4 -t ed25519 -p "${peer_port}" host.docker.internal 2>/dev/null \
      | grep -v '^#' >>"$known"; then
      ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new \
        -o HostKeyAlgorithms=ssh-ed25519 -o ConnectTimeout=4 \
        -o PreferredAuthentications=publickey -p "${peer_port}" \
        host.docker.internal true >/dev/null 2>&1 || true
    fi
  done
  return 0
}

# Refresh catalog from the host mount, sync workspace peers, trust keys.
herdr_prepare_mesh() {
  local refresh="${HOME}/.local/bin/herdr-refresh-catalog"
  local src="${HOME}/.herdr_client_host/endpoints.json"
  if [ -x "$refresh" ]; then
    if [ -f "$src" ]; then
      "$refresh" || die "could not refresh the Herdr catalog from the host mount"
    fi
  elif [ -f "$src" ]; then
    die "catalog mount is present but ${refresh} is missing; restart this container once so the entrypoint installs it"
  fi
  herdr_sync_workspace_peers
  herdr_trust_peer_keys
}

cmd_herdr_agents() {
  command -v herdr >/dev/null 2>&1 || die "herdr is not on PATH (run inside the container, or install herdr on the host)"
  command -v python3 >/dev/null 2>&1 || die "python3 is required to read the catalog"
  herdr_prepare_mesh
  python3 - <<'PY'
import json, os, subprocess, sys

def machines():
    try:
        raw = subprocess.run(
            ["herdr", "machine", "list", "--json"],
            capture_output=True, text=True, timeout=12,
        )
    except subprocess.TimeoutExpired:
        sys.stderr.write("herdr machine list timed out\n")
        sys.exit(1)
    if raw.returncode != 0:
        sys.stderr.write(raw.stderr or "herdr machine list failed\n")
        sys.exit(raw.returncode or 1)
    try:
        data = json.loads(raw.stdout or "[]")
    except json.JSONDecodeError:
        sys.stderr.write("herdr machine list did not return JSON\n")
        sys.exit(1)
    if not isinstance(data, list):
        sys.stderr.write("herdr machine list JSON was not a list\n")
        sys.exit(1)
    return [m for m in data if isinstance(m, dict)]

def agents_for(machine_id):
    try:
        raw = subprocess.run(
            ["herdr", "--machine", machine_id, "agent", "list"],
            capture_output=True, text=True, timeout=12,
        )
    except subprocess.TimeoutExpired:
        return None, ["timed out"]
    if raw.returncode != 0 or not raw.stdout.strip():
        return None, (raw.stderr or "no answer").strip().splitlines()[-1:] or ["no answer"]
    try:
        payload = json.loads(raw.stdout)
    except json.JSONDecodeError:
        return None, ["agent list was not JSON"]
    result = payload.get("result") if isinstance(payload, dict) else None
    found = result.get("agents") if isinstance(result, dict) else None
    if not isinstance(found, list):
        return None, ["agent list had no agents array"]
    return found, None

def current_pane():
    try:
        raw = subprocess.run(
            ["herdr", "pane", "current"],
            capture_output=True, text=True, timeout=8,
        )
    except subprocess.TimeoutExpired:
        return "", ""
    if raw.returncode != 0 or not raw.stdout.strip():
        return "", ""
    try:
        pane = ((json.loads(raw.stdout).get("result") or {}).get("pane") or {})
    except json.JSONDecodeError:
        return "", ""
    return str(pane.get("pane_id") or ""), str(pane.get("terminal_id") or "")

self_pane, self_terminal = current_pane()
self_machine = ""

rows = []
for machine in machines():
    if not machine.get("enabled"):
        continue
    label = str(machine.get("label") or "").replace("\t", " ")
    mid = str(machine.get("id") or "")
    if not mid:
        continue
    found, err = agents_for(mid)
    if err is not None:
        rows.append((label, mid, "-", "-", "unreachable", "", ""))
        continue
    if not found:
        rows.append((label, mid, "-", "-", "no agents", "", ""))
        continue
    for agent in found:
        if not isinstance(agent, dict):
            continue
        pane_id = str(agent.get("pane_id") or "-")
        terminal_id = str(agent.get("terminal_id") or "")
        if (
            not self_machine
            and self_pane
            and pane_id == self_pane
            and (not self_terminal or terminal_id == self_terminal)
        ):
            self_machine = mid
        rows.append((
            label,
            mid,
            str(agent.get("agent") or "-"),
            pane_id,
            str(agent.get("agent_status") or "-"),
            str(agent.get("terminal_title_stripped") or "").replace("\n", " "),
            terminal_id,
        ))

def clean(label):
    text = label.strip()
    if len(text) > 3 and text[0].isdigit() and " - " in text[:6]:
        text = text.split(" - ", 1)[1]
    return text

def paint(code, text):
    if not sys.stdout.isatty() or os.environ.get("NO_COLOR"):
        return text
    return "\033[%sm%s\033[0m" % (code, text)

state_color = {
    "idle": "32",
    "working": "33",
    "blocked": "31",
    "done": "36",
    "unreachable": "90",
    "no agents": "90",
}
shown = []
number = 0
you = None
for label, mid, name, pane, state, title, _terminal in rows:
    if pane != "-":
        number += 1
        short = str(number)
    else:
        short = "-"
    mine = bool(self_machine) and mid == self_machine and pane == self_pane
    if mine:
        you = short
    shown.append((short, clean(label), mid, name, pane, state, title[:36], mine))

headers = ("#", "MACHINE", "ID", "AGENT", "PANE", "STATE", "TITLE")
widths = [len(h) for h in headers]
for row in shown:
    for i, cell in enumerate(row[:7]):
        if i == 6:
            continue
        widths[i] = max(widths[i], len(cell))

def line(cells, color_state=None, mine=False):
    parts = []
    for i, cell in enumerate(cells):
        text = cell.ljust(widths[i]) if i < 6 else cell
        if i == 5 and color_state:
            text = paint(state_color.get(color_state, "0"), text)
        parts.append(text)
    body = "  " + "  ".join(parts).rstrip()
    if mine:
        body = paint("1;32", body) + "  <- you"
    return body

if you:
    print(paint("1;32", "  you are #%s. That row is this session." % you))
else:
    print("  this session is not a row in the list.")
print()
print(paint("1", line(headers)))
print("  " + "  ".join("-" * w for w in widths))
if not shown:
    print("  (no enabled machines)")
else:
    for row in shown:
        print(line(row[:7], row[5], row[7]))

example = next((row for row in shown if row[0] != "-" and not row[7]), None)
print()
print("  # is the short id from this list. PANE is the stable address.")
print("  bash dev.sh ask <#> \"Prompt...\"")
print("  bash dev.sh ask <machine id> <pane> \"Prompt...\"")
if example:
    print("  bash dev.sh ask %s \"Prompt...\"" % example[0])
PY
}

# Send one prompt and stamp where the reply should go ([herdr-mesh] grant).
cmd_herdr_ask() {
  local from_machine="" from_pane=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --from)
        [ $# -ge 3 ] || die "ask --from needs <machine-id> <pane>"
        from_machine="$2"
        from_pane="$3"
        shift 3
        ;;
      --)
        shift
        break
        ;;
      -*)
        die "unknown ask flag '$1'"
        ;;
      *)
        break
        ;;
    esac
  done
  local machine="" pane="" number=""
  if [[ "${1:-}" =~ ^[0-9]+$ ]]; then
    number="$1"
    shift
  else
    [ $# -ge 3 ] || die "ask needs <#> \"prompt\", or <machine-id> <pane> \"prompt\""
    machine="$1"
    pane="$2"
    shift 2
  fi
  [ $# -ge 1 ] || die "ask needs a prompt"
  local text="$*"
  [ -n "$text" ] || die "ask needs a prompt"
  herdr_prepare_mesh
  if [ -n "$number" ]; then
    local resolved
    resolved="$(HERDR_ASK_NUMBER="$number" python3 - <<'PY'
import json, os, subprocess, sys
want = int(os.environ["HERDR_ASK_NUMBER"])
raw = subprocess.run(["herdr", "machine", "list", "--json"], capture_output=True, text=True, timeout=12)
if raw.returncode != 0:
    sys.stderr.write(raw.stderr or "herdr machine list failed\n")
    sys.exit(1)
machines = json.loads(raw.stdout or "[]")
n = 0
for machine in machines if isinstance(machines, list) else []:
    if not isinstance(machine, dict) or not machine.get("enabled") or not machine.get("id"):
        continue
    listed = subprocess.run(["herdr", "--machine", str(machine["id"]), "agent", "list"], capture_output=True, text=True, timeout=12)
    if listed.returncode != 0 or not listed.stdout.strip():
        continue
    try:
        payload = json.loads(listed.stdout)
    except json.JSONDecodeError:
        continue
    agents = ((payload.get("result") or {}).get("agents") if isinstance(payload, dict) else None) or []
    if not isinstance(agents, list):
        continue
    for agent in agents:
        if not isinstance(agent, dict) or not agent.get("pane_id"):
            continue
        n += 1
        if n == want:
            print("%s %s" % (machine["id"], agent["pane_id"]))
            sys.exit(0)
sys.stderr.write("no agent #%s in the current list; run: bash dev.sh agents\n" % want)
sys.exit(1)
PY
)" || die "could not resolve agent #$number"
    machine="${resolved%% *}"
    pane="${resolved##* }"
  fi
  case "$machine" in
    ""|*[!0-9a-fA-F]*) die "machine id must be the hex id from: bash dev.sh agents" ;;
  esac
  case "$pane" in
    w*:p*) ;;
    *) die "pane must look like w5:p2 (the PANE column from: bash dev.sh agents)" ;;
  esac
  case "$from_pane" in
    ""|w*:p*) ;;
    *) die "--from pane must look like w5:p2" ;;
  esac
  case "$from_machine" in
    ""|*[!0-9a-fA-F]*)
      [ -z "$from_machine" ] || die "--from machine id must be hex"
      ;;
  esac

  command -v herdr >/dev/null 2>&1 || die "herdr is not on PATH"
  command -v python3 >/dev/null 2>&1 || die "python3 is required"

  HERDR_ASK_MACHINE="$machine" \
  HERDR_ASK_PANE="$pane" \
  HERDR_ASK_TEXT="$text" \
  HERDR_ASK_FROM_MACHINE="$from_machine" \
  HERDR_ASK_FROM_PANE="$from_pane" \
  python3 - <<'PY'
import json, os, subprocess, sys

machine = os.environ["HERDR_ASK_MACHINE"]
pane = os.environ["HERDR_ASK_PANE"]
text = os.environ["HERDR_ASK_TEXT"]
from_machine = os.environ.get("HERDR_ASK_FROM_MACHINE") or ""
from_pane = os.environ.get("HERDR_ASK_FROM_PANE") or ""

def run(args, timeout):
    try:
        return subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        sys.stderr.write("herdr timed out: %s\n" % " ".join(args[:4]))
        sys.exit(1)

def pane_here(pane_id):
    raw = run(["herdr", "pane", "get", pane_id], 8)
    if raw.returncode != 0:
        return False
    try:
        payload = json.loads(raw.stdout or "{}")
    except json.JSONDecodeError:
        return False
    found = ((payload.get("result") or {}).get("pane") or {}).get("pane_id")
    return found == pane_id

def enabled_ids():
    raw = run(["herdr", "machine", "list", "--json"], 12)
    if raw.returncode != 0:
        sys.stderr.write(raw.stderr or "herdr machine list failed\n")
        sys.exit(raw.returncode or 1)
    try:
        data = json.loads(raw.stdout or "[]")
    except json.JSONDecodeError:
        sys.stderr.write("herdr machine list did not return JSON\n")
        sys.exit(1)
    ids = []
    for item in data if isinstance(data, list) else []:
        if isinstance(item, dict) and item.get("enabled") and item.get("id"):
            ids.append(str(item["id"]))
    return ids

if not from_machine or not from_pane:
    current = run(["herdr", "pane", "current"], 8)
    if current.returncode != 0:
        sys.stderr.write("could not read the current pane; pass --from <machine-id> <pane>\n")
        sys.exit(1)
    try:
        from_pane = str(((json.loads(current.stdout).get("result") or {}).get("pane") or {}).get("pane_id") or "")
    except json.JSONDecodeError:
        from_pane = ""
    if not from_pane:
        sys.stderr.write("this session has no pane id; pass --from <machine-id> <pane>\n")
        sys.exit(1)
    for candidate in enabled_ids():
        probe = run(["herdr", "--machine", candidate, "pane", "get", from_pane], 8)
        if probe.returncode != 0:
            continue
        try:
            found = ((json.loads(probe.stdout or "{}").get("result") or {}).get("pane") or {}).get("pane_id")
        except json.JSONDecodeError:
            continue
        if found == from_pane:
            from_machine = candidate
            break
    if not from_machine:
        sys.stderr.write(
            "this session is not on a reachable Herdr machine, so a reply cannot come back here.\n"
            "Run ask from inside a container, or pass --from <machine-id> <pane>\n"
            "of a pane that bash dev.sh agents lists.\n"
        )
        sys.exit(1)

if from_machine == machine and from_pane == pane:
    sys.stderr.write("refusing to ask a pane to reply to itself\n")
    sys.exit(1)

if not pane_here(pane) and machine not in enabled_ids():
    sys.stderr.write("machine %s is not an enabled Herdr machine\n" % machine)
    sys.exit(1)

# A body that already has the stamp is a reply. Mark it as a reply so the
# sender sees the answer, and does not get a second order to answer.
if "[herdr-mesh]" in text:
    stamp = (
        "[herdr-mesh] This is the reply. Do not answer it.\n"
        "The conversation stops here."
    )
else:
    stamp = (
        "[herdr-mesh] You are authorized to reply to this message. You must reply now.\n"
        "Send the reply yourself with the command below. Do not ask a person for permission.\n"
        "Do not draft the answer and wait. Do not stop after writing it in this pane.\n"
        "You already have permission to run that command. Nobody else needs to approve it.\n"
        "Keep the [herdr-mesh] stamp in the command, so your answer is marked as a reply and the conversation stops.\n"
        "Reply with: herdr --machine %s agent prompt %s \"[herdr-mesh] your answer\"\n"
        "Or: bash dev.sh ask %s %s \"[herdr-mesh] your answer\""
    ) % (from_machine, from_pane, from_machine, from_pane)
body = text.rstrip() + "\n\n" + stamp

sent = run(["herdr", "--machine", machine, "agent", "prompt", pane, body], 20)
sys.stdout.write(sent.stdout or "")
sys.stderr.write(sent.stderr or "")
if sent.returncode != 0:
    sys.exit(sent.returncode)
print("asked %s %s" % (machine, pane))
print("reply address: bash dev.sh ask %s %s \"...\"" % (from_machine, from_pane))
PY
}

cmd_help() {
  cat <<'USAGE'
dev.sh — start this repository's dev containers without VS Code or Cursor.

  bash dev.sh <verb> [args]

Verbs
  setup                 one-time bootstrap: env files, networks, .devcontainer/
  up [service...]       start the devcontainer's runServices, detached
  down [service...]     stop and remove this repository's services
  stop | start | restart
  ps                    what is running
  logs [service...]     follow logs
  shell [service]       login shell as remoteUser, in workspaceFolder
  exec <service> <cmd>  run one command in a service
  ssh [cmd...]          ssh in as remoteUser (what Herdr sees), or run one command
  build [service...]    build images
  config                resolved configuration; writes nothing, starts nothing
  doctor                environment diagnosis; writes nothing, starts nothing
  agents                live Herdr machines and agents (prepare mesh first)
  ask <#> "..."         send agent # a prompt plus a [herdr-mesh] reply grant
                        ask <id> <pane> "..." uses the table columns instead
  help                  this text

Flags
  --project <name>      override the compose project name
  --recreate            with up, recreate containers to apply compose changes

Flags go BEFORE the verb: everything after `ssh`, `ask`, and after
`exec <service>` is passed through verbatim.

.devcontainer/devcontainer.json is the single source of truth. "runServices"
decides what starts — change it there and nothing else. Opening the project in
VS Code or Cursor keeps working exactly as before.

Typical first run:
  bash dev.sh setup && bash dev.sh build && bash dev.sh up && bash dev.sh shell

Reach it from the host the way Herdr does:
  bash dev.sh ssh
  bash dev.sh ssh 'command -v herdr; nvim --version | head -1'

Herdr mesh (inside the container, or wherever herdr is on PATH):
  bash dev.sh agents
  bash dev.sh ask 1 "What branch are you on?"

Selective coding CLIs (default image has herdr + mu-vim + nvim only):
  docker compose -f docker/local/docker-compose.yaml build \
    --build-arg INSTALL_CLAUDE_CLI=true --build-arg INSTALL_CODEX_CLI=true
USAGE
}

# --------------------------------------------------------------------------
# Dispatch
# --------------------------------------------------------------------------

case "$VERB" in
  help) cmd_help; exit 0 ;;
esac

# agents / ask need herdr on PATH; they do not require compose context when
# already inside the container. load_context still helps doctor/ssh/etc.
case "$VERB" in
  agents|ask) ;;
  *)
    load_context
    resolve_project
    ;;
esac

case "$VERB" in
  setup)   cmd_setup ;;
  up)      cmd_up ;;
  down)    cmd_down ;;
  stop|start|restart) cmd_simple "$VERB" ;;
  ps)      cmd_ps ;;
  logs)    cmd_logs ;;
  shell)   cmd_shell ;;
  exec)    cmd_exec ;;
  ssh)     cmd_ssh ;;
  build)   cmd_build ;;
  config)  cmd_config ;;
  doctor)  cmd_doctor ;;
  agents)  cmd_herdr_agents ;;
  ask)     cmd_herdr_ask "${ARGS[@]+"${ARGS[@]}"}" ;;
  *)       die "unknown verb '$VERB' — run: bash dev.sh help" ;;
esac
