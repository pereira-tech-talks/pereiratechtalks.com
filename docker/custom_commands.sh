#!/bin/bash

# Restore tool dirs that Debian login / SSH may have stripped from PATH.
#
# Herdr panes are non-login bash (source ~/.bashrc → this file) but inherit PATH
# from `herdr remote-client-bridge`, which is typically started over SSH. SSH
# login runs /etc/profile, which overwrites PATH to a minimal system list and
# drops PNPM_HOME/bin, ~/.local/bin (claude), ~/.opencode/bin, ~/.grok/bin, etc.
# Wrappers like claudex then load as shell functions but fail with
# `claude: command not found` / `codex: command not found`.
#
# Append (never prepend) so the node-first guard below can keep /usr/local/bin
# at the front. Idempotent.
export PNPM_HOME="${PNPM_HOME:-/usr/local/share/pnpm}"
for _ptt_tool_dir in \
	"${PNPM_HOME}/bin" \
	"${HOME}/.local/bin" \
	"${HOME}/.cursor/bin" \
	"${HOME}/.opencode/bin" \
	"${HOME}/.grok/bin"
do
	[ -d "${_ptt_tool_dir}" ] || continue
	case ":${PATH}:" in
		*":${_ptt_tool_dir}:"*) ;;
		*) PATH="${PATH}:${_ptt_tool_dir}" ;;
	esac
done
unset _ptt_tool_dir
export PATH

# Container-installed Node must win over IDE-bundled Node (Cursor Server's
# ~/.cursor-server/bin/<commit>/node, VS Code Server's equivalent, etc.).
# Login shells start from Debian's /etc/profile PATH (/usr/local/bin first); this guard
# covers non-login interactive shells that only source ~/.bashrc (editor
# terminals, `bash -i`, Herdr panes, the agent shell tool, …). Idempotent.
if [ -x /usr/local/bin/node ]; then
  case "${PATH}" in
    /usr/local/bin:*) : ;;  # already at the front
    *) PATH="/usr/local/bin:${PATH}" ;;
  esac
  export PATH
fi

# Load docker/local/pertechtalks/.env into every bash that sources this file.
#
# Compose injects that env_file into PID 1, so `docker exec` shells and editor
# terminals inherit it — but SSH logins (herdr --remote) do not: sshd starts
# each session from a clean environment and PermitUserEnvironment is off, so
# Herdr panes saw none of the API keys. devcontainer-kit's entrypoint writes an
# environment profile for ssh sessions; this loader re-reads the file itself so
# a fresh shell always reflects the current .env without restarting anything
# ("edit .env, open a new shell").
#
# Compose env_file semantics, not `source`: one KEY=value per line, `#`
# comments, optional matching quotes, no shell expansion. The file wins over an
# inherited value so a stale PID-1 copy cannot shadow an edited key.
PTT_ENV_FILE="${PTT_ENV_FILE:-/app/docker/local/pertechtalks/.env}"
function ptt.load_env_file {
	local file="${1:-${PTT_ENV_FILE}}" line key value
	[ -r "${file}" ] || return 0
	while IFS= read -r line || [ -n "${line}" ]; do
		line="${line#"${line%%[![:space:]]*}"}"
		line="${line#export }"
		case "${line}" in ''|'#'*) continue ;; *=*) ;; *) continue ;; esac
		key="${line%%=*}"
		value="${line#*=}"
		[[ "${key}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
		value="${value%"${value##*[![:space:]]}"}"
		case "${value}" in
			\"*\") value="${value#\"}"; value="${value%\"}" ;;
			\'*\') value="${value#\'}"; value="${value%\'}" ;;
			*) value="${value%%[[:space:]]#*}"; value="${value%"${value##*[![:space:]]}"}" ;;
		esac
		export "${key}=${value}"
	done < "${file}"
}
ptt.load_env_file

function print.success {
	GREEN="\033[0;32m"
  RESET="\033[0m"
  echo -e "${GREEN}$1${RESET}"
}

function print.error {
	RED="\033[0;31m"
  RESET="\033[0m"
  echo -e "${RED}$1${RESET}"
}

function check() {
  print.success "Running astro checks..."
	corepack pnpm run astro:check
	if [ $? != 0 ]; then
    echo ''
		print.error "⚠️ Astro checks failed, skipping astro checks..."
		return 1
	fi

	print.success "Running biome checks..."
	corepack pnpm run biome:check
}

function fix() {
  print.success "Running astro checks..."
	corepack pnpm run astro:check
	if [ $? != 0 ]; then
    echo ''
		print.error "⚠️ Astro checks failed, skipping astro checks..."
		return 1
	fi

	print.success "Running biome checks && apply automatic fixes..."
	corepack pnpm run biome:fix
}

# Named run_tests — never `test`. A function named test shadows the bash
# builtin, so every new login pane (herdr workspace) that later runs
# `test -f` / `test -n` actually launches `pnpm run test`.
unset -f test 2>/dev/null || true
function run_tests() {
  print.success "Running tests..."
	corepack pnpm run test
}

# Astro 7 has no quiet/level option for build logs (the `logging` config key is
# gone; `--silent` hides errors too), so builds in this container filter the
# per-route lines ("21:38:52   ├─ /es/quickstart.md (+3ms)") — ~2700 lines
# across 17 languages — and keep banners, errors, and warnings. The pattern is
# deliberately pure ASCII ([^0-9]+ stands in for the ├─/└─ glyphs) so it works
# even when grep falls back to the C locale and byte-mode matching. It anchors
# on the exact "(+Nms)" ending, so the build-flake error text that Astro glues
# onto a route line ("...index.htmlENOENT: ...") is NOT matched and still
# prints.
_ASTROROUTE='^[0-9]{2}:[0-9]{2}:[0-9]{2} +[^0-9]+ /[^ ]+ \(\+[0-9]+ms\)( \(restored\)| \(cached\))? *$'

# This container's bind-mounted filesystem (virtiofs on Docker Desktop) races
# with astro build in two known-transient ways: rolldown's mkdir of
# dist/.prerender fails with EEXIST when a previous build left it behind, and
# page generation intermittently fails with ENOENT on the mkdir of a
# just-created parent dir. Both go away with a clean dist/ + retry, so builds
# retry up to 3 times — but ONLY when the failure matches these signatures; a
# real error (type error, missing dep, …) fails immediately with full output.
_ASTRO_FLAKE='(Could not create directory for output chunks|File exists \(os error 17\)|ENOENT: no such file or directory, mkdir)'

function _astro_build() {
	local log status attempt
	log="$(mktemp)"
	for attempt in 1 2 3; do
		rm -rf dist
		corepack pnpm run build 2>&1 | tee "$log" | grep -vE "$_ASTROROUTE"
		status=${PIPESTATUS[0]}
		if [ "$status" = 0 ]; then
			rm -f "$log"
			return 0
		fi
		if ! grep -qE "$_ASTRO_FLAKE" "$log"; then
			rm -f "$log"
			print.error "⚠️ Build failed with a real error (not the filesystem race) — not retrying."
			return "$status"
		fi
		print.error "⚠️ Build hit the known virtiofs race (attempt $attempt/3) — retrying with a clean dist/…"
	done
	rm -f "$log"
	print.error "⚠️ Build kept hitting the filesystem race after 3 attempts."
	return 1
}

function lighthouse() {
	print.success "Building site for Lighthouse audit..."
	_astro_build
	if [ $? != 0 ]; then
		print.error "⚠️ Build failed, skipping Lighthouse audit..."
		return 1
	fi
	print.success "Running Lighthouse audit..."
	corepack pnpm run lighthouse
}

function codecheck() {
	fix
	if [ $? != 0 ]; then
    echo ''
		print.error "⚠️ Biome checks failed..."
		return 1
	fi
	print.success "Checking Markdown parity (ES/EN)..."
	corepack pnpm run md:check
	if [ $? != 0 ]; then
		print.error "⚠️ Markdown parity check failed..."
		return 1
	fi
	print.success "Generating WebP images (skips if up to date)..."
	corepack pnpm run images:webp
	if [ $? != 0 ]; then
		print.error "⚠️ WebP generation failed..."
		return 1
	fi
	run_tests
	if [ $? != 0 ]; then
		print.error "⚠️ Tests failed..."
		return 1
	fi
	lighthouse
}

function install() {
  print.success "Running pnpm install..."
	corepack pnpm install
}


function check_devcontainer() {
	if [[ -f /.dockerenv ]] || [[ -n "${REMOTE_CONTAINERS:-}" ]] || [[ -n "${CODESPACES:-}" ]]; then
		print.success "✅ Running inside Docker container"
		echo ""
		echo "All development commands are available:"
		echo "  • check, fix, run_tests, lighthouse, codecheck, install"
		return 0
	else
		print.error "❌ NOT running inside Docker container"
		echo ""
		echo "⚠️  WARNING: This project requires a Docker container environment."
		echo "   Commands like 'check', 'fix', 'run_tests', etc."
		echo "   only work inside the Docker container."
		echo ""
		echo "   To work with this project (from the repository root):"
		echo "   1. Start the container: bash dev.sh up"
		echo "   2. Open a shell inside:  bash dev.sh shell"
		echo "   3. Or reopen the folder in its Dev Container (VS Code / Cursor)"
		return 1
	fi
}


# ================================
# Git-aware Bash Prompt
# ================================

# Function to get current git branch
function git_branch() {
    local branch
    if branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null); then
        if [[ "$branch" == "HEAD" ]]; then
            branch='detached*'
        fi
        echo "$branch"
    fi
}

# Function to get git status indicators
function git_status_indicator() {
    local git_status
    git_status=$(git status --porcelain 2>/dev/null)

    if [[ -n "$git_status" ]]; then
        echo "*"  # Asterisk for uncommitted changes
    fi
}

# Speed up `git status` on macOS bind mounts (caches the untracked-files walk).
# Repo-local; do not enable core.fsmonitor — unreliable through this mount.
# Written once: every new shell sources this file, and concurrent writers would
# race for .git/config.lock.
if git rev-parse --git-dir >/dev/null 2>&1 && [ "$(git config --get core.untrackedcache 2>/dev/null)" != "true" ]; then
    git config core.untrackedcache true 2>/dev/null || true
fi

# Cached git dirty state for the prompt. `git status` costs ~0.4s on the
# macOS bind mount even with core.untrackedCache, so refresh at most every
# 5 seconds instead of on every prompt redraw.
__GIT_DIRTY_CACHE=""
__GIT_DIRTY_REPO=""
__GIT_DIRTY_TS=-10

# Custom PS1 prompt with colors and git info
function set_bash_prompt() {
    local exit_code=$?

    # Color codes
    local yellow="\[\033[0;33m\]"
    local red="\[\033[0;31m\]"
    local green="\[\033[0;32m\]"
    local white="\[\033[0;37m\]"
    local reset="\[\033[0m\]"

    # Get git branch and status
    local git_info=""
    local repo_root
    repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [[ -n "$repo_root" ]]; then
        local branch
        branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

        if [[ "$branch" == "HEAD" ]]; then
            branch='detached*'
        fi

        if [[ "$repo_root" != "$__GIT_DIRTY_REPO" ]] || (( SECONDS - __GIT_DIRTY_TS >= 5 )); then
            if [[ -n $(git status --porcelain 2>/dev/null) ]]; then
                __GIT_DIRTY_CACHE=1
            else
                __GIT_DIRTY_CACHE=0
            fi
            __GIT_DIRTY_REPO="$repo_root"
            __GIT_DIRTY_TS=$SECONDS
        fi

        if [[ "$__GIT_DIRTY_CACHE" == 1 ]]; then
            git_info=" ${red}(${branch}*)${reset}"
        else
            git_info=" ${green}(${branch})${reset}"
        fi
    fi

    # Build the prompt - simple format: path (git) $
    PS1="${yellow}\w${reset}${git_info}${white} \$ ${reset}"
}

# Set the custom prompt
PROMPT_COMMAND=set_bash_prompt

# ================================
# Useful Git Aliases
# ================================

alias gs='git status'
alias ga='git add .'
alias gc='git commit -am'
alias gp='git push -u origin HEAD'
alias gl='git log --oneline --graph --decorate --all -20'
alias gd='git diff'
alias gb='git for-each-ref --sort=-committerdate refs/heads/ --format="%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:green)%(committerdate:relative)%(color:reset) - %(color:blue)%(authorname)%(color:reset)"'
alias gbd='git branch -D'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gpl='git pull origin HEAD'
alias grc='git rm -r --cached .'
alias help='show_welcome'

# Welcome message
function show_welcome() {
    echo ""
    print.success "🚀 Pereira Tech Talks Development Container"
    echo ""

    # Check container status
    check_devcontainer
    echo ""

    echo "Useful commands:"
    echo "  • check_devcontainer  - Check if running inside Docker container (CRITICAL)"
    echo "  • help                 - Show this message"
    echo "  • check                - Run astro and biome checks"
    echo "  • fix                  - Run checks and apply automatic fixes"
    echo "  • run_tests            - Run tests"
    echo "  • lighthouse           - Build site + run Lighthouse audit"
    echo "  • codecheck            - Run all checks (fix + md:check + images:webp + test + lighthouse)"
    echo "  • install              - Run pnpm install"
    echo ""
    echo "Coding agents (coding-agents-kit — ak doctor lists them):"
    echo "  • claudex, codexx, cursorx, opencodex, pix, clinex, grokx   - each CLI through ak"
    echo "  • claude-glm, codex-glm, opencode-glm, pi-glm             - Z.AI GLM"
    echo "  • codex-azure, opencode-azure, pi-azure, cline-azure      - Azure OpenAI / Foundry"
    echo "  • codex-xai, opencode-xai, pi-xai, cline-xai              - xAI"
    echo "  Agents run in autonomy by default (this container is the sandbox)."
    echo "  Opt-out: AGENTKIT_PERMISSIONS=ask in docker/local/pertechtalks/.env, or ak <kind> --ask."
    echo ""
    echo "Herdr (from the host: bash dev.sh agents | ask <machine>:<pane> \"...\"):"
    echo "  • herdr-peers list  - the live agents on every Herdr machine"
    echo ""
    echo "Git shortcuts:"
    echo "  • gs   - git status"
    echo "  • ga   - git add ."
    echo "  • gc   - git commit"
    echo "  • gp   - git push -u origin HEAD"
    echo "  • gpl  - git pull origin HEAD"
    echo "  • gl   - git log (pretty)"
    echo "  • gd   - git diff"
    echo "  • gb   - git branch"
    echo "  • gbd  - git branch -D"
    echo "  • gco  - git checkout"
    echo "  • gcob - git checkout -b"
    echo "  • grc  - git rm -r --cached . (reset cache, useful after updating .gitignore)"
    echo ""
}

# Welcome banner: once per shell, never inside Herdr panes.
# Login herdr panes source this file twice (profile.d + ~/.bashrc) and every
# new workspace is an interactive login shell — dumping the banner there looks
# like a command launched on its own.
if [[ $- == *i* && -z "${HERDR_ENV:-}" && -z "${PTT_WELCOME_SHOWN:-}" ]]; then
    show_welcome
fi
export PTT_WELCOME_SHOWN=1
