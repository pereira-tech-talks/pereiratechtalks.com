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

VERBS=" setup up down stop start restart ps logs shell exec ssh build config doctor help "

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
  if [ "$VERB" = "ssh" ] || { [ "$VERB" = "exec" ] && [ "${#ARGS[@]}" -ge 1 ]; }; then
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
  help                  this text

Flags
  --project <name>      override the compose project name
  --recreate            with up, recreate containers to apply compose changes

Flags go BEFORE the verb: everything after `ssh` and after `exec <service>` is
passed to the container verbatim.

.devcontainer/devcontainer.json is the single source of truth. "runServices"
decides what starts — change it there and nothing else. Opening the project in
VS Code or Cursor keeps working exactly as before.

Typical first run:
  bash dev.sh setup && bash dev.sh build && bash dev.sh up && bash dev.sh shell

Reach it from the host the way Herdr does:
  bash dev.sh ssh
  bash dev.sh ssh 'command -v codex; herdr --version'
USAGE
}

# --------------------------------------------------------------------------
# Dispatch
# --------------------------------------------------------------------------

case "$VERB" in
  help) cmd_help; exit 0 ;;
esac

load_context
resolve_project

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
  *)       die "unknown verb '$VERB' — run: bash dev.sh help" ;;
esac
