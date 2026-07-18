#!/bin/bash

# Container-installed Node must win over IDE-bundled Node (Cursor Server's
# ~/.cursor-server/bin/<commit>/node, VS Code Server's equivalent, etc.).
# /etc/profile.d/00-container-node-first.sh covers login shells; this guard
# covers non-login interactive shells that only source ~/.bashrc (editor
# terminals, `bash -i`, the agent shell tool, …). Idempotent: only prepends
# when /usr/local/bin is not already the first PATH entry.
if [ -x /usr/local/bin/node ]; then
  case "${PATH%%:*}" in
    /usr/local/bin) : ;;
    *) PATH="/usr/local/bin:${PATH}" ;;
  esac
  export PATH
fi

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

function test() {
  print.success "Running tests..."
	corepack pnpm run test
}

function lighthouse() {
	print.success "Building site for Lighthouse audit..."
	corepack pnpm run build
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
	print.success "Checking Markdown parity (EN/ES)..."
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
	test
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

# ================================
# Codex CLI with full permissions (bypass approvals and sandbox)
# ================================
# Usage:
#   codexx              - Start new session
#   codexx -l|--last    - Resume last session
#   codexx -r|--resume  - Interactive session selection
#   codexx -r <id>      - Resume specific session by ID
function codexx() {
	case "${1:-}" in
		-l|--last)
			print.success "Resuming last Codex session..."
			shift
			codex resume --last --dangerously-bypass-approvals-and-sandbox "$@"
			;;
		-r|--resume)
			shift
			if [[ -n "${1:-}" && "${1:0:1}" != "-" ]]; then
				# Resume specific session by ID
				local session_id="$1"
				shift
				print.success "Resuming Codex session: $session_id..."
				codex resume "$session_id" --dangerously-bypass-approvals-and-sandbox "$@"
			else
				# Interactive session selection
				print.success "Selecting Codex session to resume..."
				codex resume --all --dangerously-bypass-approvals-and-sandbox "$@"
			fi
			;;
		*)
			print.success "Starting new Codex session with full permissions..."
			codex --dangerously-bypass-approvals-and-sandbox "$@"
			;;
	esac
}

# ================================
# Claude Code with full permissions (skip all permission prompts)
# ================================
# Usage:
#   claudex                - Start new session
#   claudex -c|--continue  - Continue most recent session
#   claudex -r|--resume    - Interactive session selection
#   claudex -r <id>        - Resume specific session by ID
function claudex() {
	# Works when running as dev-user (non-root) which is the default in devcontainer
	case "${1:-}" in
		-c|--continue)
			print.success "Continuing most recent Claude Code session..."
			shift
			claude --continue --dangerously-skip-permissions "$@"
			;;
		-r|--resume)
			shift
			if [[ -n "${1:-}" && "${1:0:1}" != "-" ]]; then
				# Resume specific session by ID
				local session_id="$1"
				shift
				print.success "Resuming Claude Code session: $session_id..."
				claude --resume "$session_id" --dangerously-skip-permissions "$@"
			else
				# Interactive session selection
				print.success "Selecting Claude Code session to resume..."
				claude --resume --dangerously-skip-permissions "$@"
			fi
			;;
		*)
			print.success "Starting new Claude Code session with full permissions..."
			claude --dangerously-skip-permissions "$@"
			;;
	esac
}

# ================================
# Cursor CLI agent (interactive mode with full permissions)
# ================================
# Usage:
#   cursorx              - Start new session
#   cursorx -l|--list    - List available sessions
#   cursorx -r|--resume  - Resume last session
#   cursorx -r <id>      - Resume specific session by ID
function cursorx() {
	# Cursor CLI uses 'agent' command with --force to bypass all approval prompts
	case "${1:-}" in
		-l|--list)
			print.success "Listing Cursor CLI sessions..."
			shift
			agent ls "$@"
			;;
		-r|--resume)
			shift
			if [[ -n "${1:-}" && "${1:0:1}" != "-" ]]; then
				# Resume specific session by ID
				local session_id="$1"
				shift
				print.success "Resuming Cursor CLI session: $session_id..."
				agent --resume="$session_id" --force "$@"
			else
				# Resume last session
				print.success "Resuming last Cursor CLI session..."
				agent resume --force "$@"
			fi
			;;
		*)
			print.success "Starting new Cursor CLI session with full permissions..."
			agent --force "$@"
			;;
	esac
}

# Check if running inside Docker container
function check_devcontainer() {
	if [[ -f /.dockerenv ]] || [[ -n "${REMOTE_CONTAINERS:-}" ]] || [[ -n "${CODESPACES:-}" ]]; then
		print.success "✅ Running inside Docker container"
		echo ""
		echo "All development commands are available:"
		echo "  • check, fix, test, lighthouse, codecheck, install"
		return 0
	else
		print.error "❌ NOT running inside Docker container"
		echo ""
		echo "⚠️  WARNING: This project requires a Docker container environment."
		echo "   Commands like 'check', 'fix', 'test', etc."
		echo "   only work inside the Docker container."
		echo ""
		echo "   To work with this project:"
		echo "   1. Start Docker services: cd docker/local && bash docker.sh up"
		echo "   2. Access the container: bash docker.sh bash pertechtalks"
		echo "   3. Or use VS Code Dev Containers if configured"
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
    echo "  • test                 - Run tests"
    echo "  • lighthouse           - Build site + run Lighthouse audit"
    echo "  • codecheck            - Run all checks (fix + md:check + images:webp + test + lighthouse)"
    echo "  • install              - Run pnpm install"
    echo ""
    echo "AI Assistant commands:"
    echo "  • claude            - Claude Code CLI"
    echo "  • codex             - Codex CLI"
    echo "  • agent             - Cursor CLI agent (or cursorx alias)"
    echo ""
    echo "  • codexx            - Codex with full permissions (bypass approvals and sandbox)"
    echo "      -l, --last      Resume last session"
    echo "      -r, --resume    Interactive session selection"
    echo "      -r <id>         Resume specific session by ID"
    echo ""
    echo "  • claudex           - Claude Code with full permissions (skip all permission prompts)"
    echo "      -c, --continue  Continue most recent session"
    echo "      -r, --resume    Interactive session selection"
    echo "      -r <id>         Resume specific session by ID"
    echo ""
    echo "  • cursorx           - Cursor CLI agent (interactive mode)"
    echo "      -l, --list      List available sessions"
    echo "      -r, --resume    Resume last session"
    echo "      -r <id>         Resume specific session by ID"
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

# Show welcome message only for interactive shells
if [[ $- == *i* ]]; then
    show_welcome
fi
