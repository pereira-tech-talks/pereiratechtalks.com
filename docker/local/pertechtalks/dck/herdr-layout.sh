#!/usr/bin/env bash
#
# dck-herdr-layout [--keep | --reset] — the standard Herdr sidebar inside the
# container: Home · Editor · Development (server | tests) · Agents (Agent 1..4).
#
# Runs as the container user against the container's own Herdr server (the one
# the host Herdr talks to when it attaches this machine). `dck herdr layout`
# docker-execs it; `dck up` runs it with --keep after `dck herdr add`.
#
#   --keep    keep what exists and create only what is missing. Development is
#             split only when it has exactly one pane: two or more panes (a
#             layout arranged by hand) or an unreadable count are left alone.
#             A tab whose presence cannot be read is skipped, never duplicated.
#   --reset   close the four standard workspaces (and the legacy "Home (~)")
#             and recreate them; no other workspace is touched; aborts if any
#             of them cannot be closed.
#   (none)    with a TTY, ask [y/N] whether to reset (default: keep); without a
#             TTY, keep.
#
# Every pane is a plain shell in the workspace directory: the layout starts no
# program. Everything is created with --no-focus; Home gets the focus at the end.
set -euo pipefail

say() { printf 'herdr-layout: %s\n' "$*"; }
die() { printf 'herdr-layout: %s\n' "$*" >&2; exit "${2:-1}"; }

mode=""
for arg in "$@"; do
  case "$arg" in
    --keep) [ "$mode" = reset ] && die "use either --keep or --reset" 2; mode=keep ;;
    --reset) [ "$mode" = keep ] && die "use either --keep or --reset" 2; mode=reset ;;
    -h|--help) sed -n '2,21p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "unknown flag '$arg' (use --keep or --reset)" 2 ;;
  esac
done
command -v herdr >/dev/null 2>&1 || die "herdr is not on PATH in this container" 4
command -v python3 >/dev/null 2>&1 || die "python3 is required" 4
if [ -z "$mode" ]; then
  mode=keep
  if [ -t 0 ]; then
    printf 'Reset the existing Home / Editor / Development / Agents workspaces? [y/N] '
    read -r ans || true
    case "${ans:-}" in y|Y|yes|YES) mode=reset ;; esac
  fi
fi
cwd="${DCK_LAYOUT_CWD:-${DCK_WORKSPACE:-$PWD}}"

# json <expr> — evaluate a python expression over the JSON object in stdin
# (Herdr may print text around it); prints nothing when it cannot be read.
json() {
  python3 -c '
import json, sys
raw = sys.stdin.read(); s = raw.find("{"); e = raw.rfind("}")
if s < 0 or e < s: raise SystemExit(0)
try: d = json.loads(raw[s:e + 1])
except ValueError: raise SystemExit(0)
r = d.get("result") or d
try: v = eval(sys.argv[1], {"r": r})
except Exception: raise SystemExit(0)
print("" if v is None else v)
' "$1" 2>/dev/null || true
}

ws_id() {  # ws_id <label> — the workspace id with exactly that label, or empty
  herdr workspace list 2>/dev/null | json "next((w.get('workspace_id') or '' for w in (r.get('workspaces') or []) if (w.get('label') or '') == $(printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')), '')"
}

ws_create() {  # ws_create <label> — prints "<workspace>\t<root pane>\t<tab>"
  herdr workspace create --cwd "$cwd" --label "$1" --no-focus 2>&1 | json \
    "'%s\t%s\t%s' % ((r.get('workspace') or {}).get('workspace_id') or (r.get('root_pane') or {}).get('workspace_id') or '', (r.get('root_pane') or {}).get('pane_id') or '', (r.get('tab') or {}).get('tab_id') or (r.get('root_pane') or {}).get('tab_id') or '')"
}

tab_create() {  # tab_create <workspace> <label> — prints the new tab id
  herdr tab create --workspace "$1" --cwd "$cwd" --label "$2" --no-focus 2>&1 | json \
    "(r.get('tab') or {}).get('tab_id') or (r.get('root_pane') or r.get('pane') or {}).get('tab_id') or ''"
}

split_right() {  # split_right <pane> — prints the new pane id
  herdr pane split "$1" --direction right --cwd "$cwd" --no-focus 2>&1 | json "(r.get('pane') or {}).get('pane_id') or ''"
}

pane_count() {  # pane_count <workspace> — the number of panes, or "unknown"
  local out
  out="$(herdr pane list --workspace "$1" 2>/dev/null | json "len(r.get('panes')) if isinstance(r.get('panes'), list) else ''")"
  printf '%s' "${out:-unknown}"
}

first_pane() {
  herdr pane list --workspace "$1" 2>/dev/null | json "((r.get('panes') or [{}])[0] or {}).get('pane_id') or ''"
}

tab_state() {  # tab_state <workspace> <label> — present | absent | unknown
  local out
  out="$(herdr tab list --workspace "$1" 2>/dev/null | json "('present' if any((t.get('label') or '') == $(printf '%s' "$2" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))') for t in r.get('tabs')) else 'absent') if isinstance(r.get('tabs'), list) else ''")"
  printf '%s' "${out:-unknown}"
}

close_label() {  # close_label <label> — 0 when gone (or never there)
  local wid left
  wid="$(ws_id "$1")"
  [ -n "$wid" ] || return 0
  herdr workspace close "$wid" >/dev/null 2>&1 || { say "could not close $1 ($wid)"; return 1; }
  for _ in 1 2 3 4 5 6 7 8 9 10; do  # the close may finish just after the call returns
    left="$(ws_id "$1")"
    [ -n "$left" ] || { say "closed $1"; return 0; }
    sleep 0.2
  done
  say "$1 is still present after close ($left)"
  return 1
}

if [ "$mode" = reset ]; then
  say "resetting Home · Editor · Development · Agents"
  failed=0
  for label in Home "Home (~)" Editor Development Agents; do
    close_label "$label" || failed=1
  done
  [ "$failed" -eq 0 ] || die "--reset could not close every standard workspace; nothing was recreated"
fi

# simple <label> <pane name> — a one-pane workspace.
simple() {
  local id line pane
  id="$(ws_id "$1")"
  if [ -n "$id" ]; then say "$1 already present" >&2; printf '%s' "$id"; return 0; fi
  line="$(ws_create "$1")"
  id="$(printf '%s' "$line" | cut -f1)"; pane="$(printf '%s' "$line" | cut -f2)"
  [ -n "$id" ] || die "could not create $1"
  [ -z "$pane" ] || herdr pane rename "$pane" "$2" >/dev/null 2>&1 || true
  say "created $1" >&2
  printf '%s' "$id"
}

home_ws="$(simple Home home)"
simple Editor editor >/dev/null

dev_ws="$(ws_id Development)"
if [ -z "$dev_ws" ]; then
  line="$(ws_create Development)"
  dev_ws="$(printf '%s' "$line" | cut -f1)"; pane="$(printf '%s' "$line" | cut -f2)"; tab="$(printf '%s' "$line" | cut -f3)"
  [ -n "$dev_ws" ] && [ -n "$pane" ] || die "could not create Development"
  [ -z "$tab" ] || herdr tab rename "$tab" Development >/dev/null 2>&1 || true
  herdr pane rename "$pane" server >/dev/null 2>&1 || true
  tests="$(split_right "$pane")"
  if [ -n "$tests" ]; then herdr pane rename "$tests" tests >/dev/null 2>&1 || true; say "created Development (server | tests)"
  else say "created Development without the tests split (no pane id returned)"; fi
else
  say "Development already present"
  if [ "$(pane_count "$dev_ws")" = "1" ]; then
    pane="$(first_pane "$dev_ws")"
    if [ -n "$pane" ]; then
      tests="$(split_right "$pane")"
      if [ -n "$tests" ]; then herdr pane rename "$tests" tests >/dev/null 2>&1 || true; say "added the Development tests split"; fi
    fi
  fi
fi

agents_ws="$(ws_id Agents)"
if [ -z "$agents_ws" ]; then
  line="$(ws_create Agents)"
  agents_ws="$(printf '%s' "$line" | cut -f1)"; pane="$(printf '%s' "$line" | cut -f2)"; tab="$(printf '%s' "$line" | cut -f3)"
  [ -n "$agents_ws" ] && [ -n "$pane" ] || die "could not create Agents"
  [ -z "$tab" ] || herdr tab rename "$tab" "Agent 1" >/dev/null 2>&1 || true
  say "created Agents / Agent 1"
  for n in 2 3 4; do
    [ -n "$(tab_create "$agents_ws" "Agent $n")" ] || die "could not create Agent $n"
    say "created Agents / Agent $n"
  done
else
  say "Agents already present"
  for n in 1 2 3 4; do
    case "$(tab_state "$agents_ws" "Agent $n")" in
      present) ;;
      absent)
        if [ -n "$(tab_create "$agents_ws" "Agent $n")" ]; then say "created Agents / Agent $n"
        else say "could not create Agent $n (skipped)"; fi ;;
      *) say "could not read the Agents tabs; Agent $n skipped" ;;
    esac
  done
fi

[ -z "$home_ws" ] || herdr workspace focus "$home_ws" >/dev/null 2>&1 || true
say "ready — Home · Editor · Development · Agents"
