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
#   codexx               - Start new session
#   codexx -c|--continue - Continue most recent session
#   codexx -l|--last     - Resume last session
#   codexx -r|--resume   - Interactive session selection
#   codexx -r <id>       - Resume specific session by ID
function codexx() {
	case "${1:-}" in
		-c|--continue)
			print.success "Continuing most recent Codex session..."
			shift
			command codex resume --last --dangerously-bypass-approvals-and-sandbox "$@"
			;;
		-l|--last)
			print.success "Resuming last Codex session..."
			shift
			command codex resume --last --dangerously-bypass-approvals-and-sandbox "$@"
			;;
		-r|--resume)
			shift
			if [[ -n "${1:-}" && "${1:0:1}" != "-" ]]; then
				# Resume specific session by ID
				local session_id="$1"
				shift
				print.success "Resuming Codex session: $session_id..."
				command codex resume "$session_id" --dangerously-bypass-approvals-and-sandbox "$@"
			else
				# Interactive session selection
				print.success "Selecting Codex session to resume..."
				command codex resume --all --dangerously-bypass-approvals-and-sandbox "$@"
			fi
			;;
		*)
			print.success "Starting new Codex session with full permissions..."
			command codex --dangerously-bypass-approvals-and-sandbox "$@"
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

# ================================
# Complete coding-agent command suite
# ================================
# Base commands preserve the provider and authentication configured by the user.
function _require_agent_command() {
	if ! type -P "$1" >/dev/null 2>&1; then
		print.error "$1 is not on PATH."
		return 1
	fi
}

function _require_agent_env() {
	if [[ -z "${!1:-}" ]]; then
		print.error "$1 is not set."
		echo "Add it to docker/local/pertechtalks/.env and open a new shell (or rebuild the container)."
		return 1
	fi
}

function claude() {
	_require_agent_command claude || return 1
	case "${1:-}" in
		-c|--continue) shift; command claude --continue "$@" ;;
		*) command claude "$@" ;;
	esac
}

function codex() {
	_require_agent_command codex || return 1
	case "${1:-}" in
		-c|--continue) shift; command codex resume --last "$@" ;;
		*) command codex "$@" ;;
	esac
}

function opencode() {
	_require_agent_command opencode || return 1
	case "${1:-}" in
		-c|--continue) shift; command opencode --continue "$@" ;;
		*) command opencode "$@" ;;
	esac
}

function pi() {
	_require_agent_command pi || return 1
	command pi "$@"
}

function cline() {
	_require_agent_command cline || return 1
	case "${1:-}" in
		-c|--continue) shift; command cline --continue "$@" ;;
		*) command cline "$@" ;;
	esac
}

function agent() {
	_require_agent_command agent || return 1
	case "${1:-}" in
		-c|--continue) shift; command agent resume "$@" ;;
		*) command agent "$@" ;;
	esac
}

function herdr() {
	_require_agent_command herdr || return 1
	case "${1:-}" in
		-c|--continue) shift; command herdr --continue "$@" ;;
		*) command herdr "$@" ;;
	esac
}

function chelper() {
	if type -P chelper >/dev/null 2>&1; then
		command chelper "$@"
	else
		corepack pnpm dlx @z_ai/coding-helper "$@"
	fi
}

# All aliases ending in -xai, -azure, -glm, plus pix, use full permissions.
function codex-azure() {
	_require_agent_env AZURE_OPENAI_API_KEY || return 1
	case "${1:-}" in
		-c|--continue) shift; codex resume --last --dangerously-bypass-approvals-and-sandbox "$@" ;;
		*) print.success "Starting Codex with Azure OpenAI in full permissions mode..."; codex --dangerously-bypass-approvals-and-sandbox "$@" ;;
	esac
}

function codex-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	case "${1:-}" in
		-c|--continue) shift; codex resume --last --dangerously-bypass-approvals-and-sandbox "$@" ;;
		*) print.success "Starting Codex with Z.AI GLM in full permissions mode..."; ZAI_CODING_API_KEY="${ZAI_CODING_API_KEY}" codex --dangerously-bypass-approvals-and-sandbox "$@" ;;
	esac
}

function codex-xai() {
	_require_agent_env XAI_API_KEY || return 1
	case "${1:-}" in
		-c|--continue) shift; codex resume --last --dangerously-bypass-approvals-and-sandbox "$@" ;;
		*) print.success "Starting Codex with xAI Grok in full permissions mode..."; XAI_API_KEY="${XAI_API_KEY}" codex --dangerously-bypass-approvals-and-sandbox "$@" ;;
	esac
}

# ================================
# Claude Code via Z.AI GLM Coding Plan — does not touch the default `claude` /
# Anthropic auth. Requires ZAI_CODING_API_KEY in docker/local/pertechtalks/.env
# (it survives rebuilds). The Opus/Sonnet/Haiku aliases are remapped to GLM for
# this process only — nothing is written to ~/.claude/settings.json.
# Docs: https://docs.z.ai/devpack/quick-start · https://docs.z.ai/devpack/latest-model
# ================================
function _zai_claude_run() {
	local -a claude_args=("$@")
	local opus_model="${ZAI_DEFAULT_OPUS_MODEL:-glm-5.3}"
	local sonnet_model="${ZAI_DEFAULT_SONNET_MODEL:-glm-5.3}"
	local haiku_model="${ZAI_DEFAULT_HAIKU_MODEL:-glm-5.3-flash}"
	local timeout_ms="${ZAI_CODING_API_TIMEOUT_MS:-3000000}"
	# Optional 1M context: set models to e.g. glm-5.3[1m] and ZAI_CODING_AUTO_COMPACT_WINDOW=1000000
	local compact_window="${ZAI_CODING_AUTO_COMPACT_WINDOW:-}"

	if [[ -n "${compact_window}" ]]; then
		ANTHROPIC_AUTH_TOKEN="${ZAI_CODING_API_KEY}" \
			ANTHROPIC_BASE_URL="${ZAI_ANTHROPIC_BASE_URL:-https://api.z.ai/api/anthropic}" \
			API_TIMEOUT_MS="${timeout_ms}" \
			ANTHROPIC_DEFAULT_OPUS_MODEL="${opus_model}" \
			ANTHROPIC_DEFAULT_SONNET_MODEL="${sonnet_model}" \
			ANTHROPIC_DEFAULT_HAIKU_MODEL="${haiku_model}" \
			CLAUDE_CODE_AUTO_COMPACT_WINDOW="${compact_window}" \
			claude "${claude_args[@]}"
	else
		ANTHROPIC_AUTH_TOKEN="${ZAI_CODING_API_KEY}" \
			ANTHROPIC_BASE_URL="${ZAI_ANTHROPIC_BASE_URL:-https://api.z.ai/api/anthropic}" \
			API_TIMEOUT_MS="${timeout_ms}" \
			ANTHROPIC_DEFAULT_OPUS_MODEL="${opus_model}" \
			ANTHROPIC_DEFAULT_SONNET_MODEL="${sonnet_model}" \
			ANTHROPIC_DEFAULT_HAIKU_MODEL="${haiku_model}" \
			claude "${claude_args[@]}"
	fi
}

function claude-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	print.success "Starting Claude Code with Z.AI GLM (${ZAI_DEFAULT_OPUS_MODEL:-glm-5.3} / ${ZAI_DEFAULT_SONNET_MODEL:-glm-5.3}) in full permissions mode..."
	_zai_claude_run --dangerously-skip-permissions "$@"
}

function claudex-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	case "${1:-}" in
		-c|--continue)
			shift
			print.success "Continuing most recent Claude Code session (Z.AI GLM)..."
			_zai_claude_run --continue --dangerously-skip-permissions "$@"
			;;
		-r|--resume)
			shift
			if [[ -n "${1:-}" && "${1:0:1}" != "-" ]]; then
				local session_id="$1"
				shift
				print.success "Resuming Claude Code session (Z.AI GLM): $session_id..."
				_zai_claude_run --resume "$session_id" --dangerously-skip-permissions "$@"
			else
				print.success "Selecting Claude Code session to resume (Z.AI GLM)..."
				_zai_claude_run --resume --dangerously-skip-permissions "$@"
			fi
			;;
		*)
			claude-glm "$@"
			;;
	esac
}

function claude-xai() {
	_require_agent_env XAI_API_KEY || return 1
	print.success "Starting Claude Code with xAI Grok in full permissions mode..."
	ANTHROPIC_AUTH_TOKEN="${XAI_API_KEY}" ANTHROPIC_BASE_URL="${XAI_ANTHROPIC_BASE_URL:-https://api.x.ai}" claude --dangerously-skip-permissions "$@"
}

function opencodex() {
	print.success "Starting OpenCode with full permissions mode (--auto)..."
	opencode --auto "$@"
}

# Merge one provider into OpenCode's persisted configuration. OpenCode does
# not infer custom model IDs from an API key: each wrapper must declare the
# provider, endpoint, default model, and the exact model IDs it exposes.
function _opencode_sync_provider_config() {
	local provider_id="$1"
	local api_key="$2"
	local base_url="$3"
	local default_model="$4"
	shift 4
	local config_dir="${HOME}/.config/opencode"
	local config_file="${config_dir}/opencode.json"

	mkdir -p "${config_dir}"
	python3 - "${config_file}" "${provider_id}" "${api_key}" "${base_url}" "${default_model}" "$@" <<'PY'
import json
import sys
from pathlib import Path

config_path = Path(sys.argv[1])
provider_id, api_key, base_url, default_model = sys.argv[2:6]
model_ids = sys.argv[6:]

data = {}
if config_path.exists():
    try:
        data = json.loads(config_path.read_text())
    except json.JSONDecodeError:
        data = {}

data["$schema"] = "https://opencode.ai/config.json"
providers = data.setdefault("provider", {})
provider = providers.setdefault(provider_id, {})
options = provider.setdefault("options", {})
options["apiKey"] = api_key
options["baseURL"] = base_url

# Custom providers default to text-only and may retain stale models from a
# previous wrapper invocation. Explicit metadata plus a whitelist fixes both.
provider["whitelist"] = model_ids
models = provider.setdefault("models", {})
for model_id in model_ids:
    models[model_id] = {
        "id": model_id,
        "name": model_id,
        "attachment": True,
        "modalities": {"input": ["text", "image"], "output": ["text"]},
    }
for model_id in list(models):
    if model_id not in model_ids:
        del models[model_id]

data["model"] = f"{provider_id}/{default_model}"
config_path.write_text(json.dumps(data, indent=2) + "\n")
# The file holds a live provider API key; the default 0644 would leave it
# readable by every account and process in the container, ssh sessions included.
config_path.chmod(0o600)
PY
}

function opencode-azure() {
	_require_agent_env AZURE_OPENAI_API_KEY || return 1
	local resource="${AZURE_OPENAI_RESOURCE:-}"
	local base_url="${AZURE_OPENAI_BASE_URL:-}"
	local daily="${AZURE_OPENAI_MODEL_DAILY:-gpt-5.4-mini-azure}"
	local reasoning="${AZURE_OPENAI_MODEL_REASONING:-gpt-5.4-azure}"
	local default_model="${AZURE_OPENAI_DEFAULT_MODEL:-${daily}}"
	if [[ -z "${base_url}" && -n "${resource}" ]]; then
		base_url="https://${resource}.services.ai.azure.com/openai/v1"
	fi
	if [[ -z "${base_url}" ]]; then
		print.error "AZURE_OPENAI_RESOURCE or AZURE_OPENAI_BASE_URL is required."
		return 1
	fi
	_opencode_sync_provider_config azure "${AZURE_OPENAI_API_KEY}" "${base_url}" "${default_model}" "${daily}" "${reasoning}" || return 1
	print.success "Starting OpenCode with Azure OpenAI in full permissions mode (--auto)..."
	AZURE_RESOURCE_NAME="${resource}" AZURE_API_KEY="${AZURE_OPENAI_API_KEY}" opencode --auto "$@"
}

function opencode-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	local opus="${ZAI_DEFAULT_OPUS_MODEL:-glm-5.3}"
	local sonnet="${ZAI_DEFAULT_SONNET_MODEL:-glm-5.3}"
	local haiku="${ZAI_DEFAULT_HAIKU_MODEL:-glm-5.3-flash}"
	local default_model="${ZAI_OPENCODE_DEFAULT_MODEL:-${sonnet}}"
	_opencode_sync_provider_config zai-coding-plan "${ZAI_CODING_API_KEY}" "${ZAI_CODING_BASE_URL:-https://api.z.ai/api/coding/paas/v4}" "${default_model}" "${sonnet}" "${opus}" "${haiku}" || return 1
	print.success "Starting OpenCode with Z.AI GLM in full permissions mode (--auto)..."
	ZHIPU_API_KEY="${ZAI_CODING_API_KEY}" ZAI_API_KEY="${ZAI_CODING_API_KEY}" opencode --auto "$@"
}

function opencode-xai() {
	_require_agent_env XAI_API_KEY || return 1
	local daily="${XAI_MODEL_DAILY:-grok-4.3}"
	local reasoning="${XAI_MODEL_REASONING:-grok-4.6}"
	local default_model="${XAI_DEFAULT_MODEL:-${daily}}"
	_opencode_sync_provider_config xai "${XAI_API_KEY}" "${XAI_BASE_URL:-https://api.x.ai/v1}" "${default_model}" "${daily}" "${reasoning}" || return 1
	print.success "Starting OpenCode with xAI Grok in full permissions mode (--auto)..."
	XAI_API_KEY="${XAI_API_KEY}" opencode --auto "$@"
}

function grokx() {
	_require_agent_env XAI_API_KEY || return 1
	_require_agent_command grok || return 1
	print.success "Starting official Grok CLI (xAI) with full permissions mode..."
	case "${1:-}" in
		-c|--continue) shift; grok --continue "$@" ;;
		*) grok "$@" ;;
	esac
}

function pix() {
	print.success "Starting Pi (pix) with full permissions mode (--approve)..."
	case "${1:-}" in
		-c|--continue) shift; pi -c --approve "$@" ;;
		*) pi --approve "$@" ;;
	esac
}

function _pi_sync_xai_config() {
	local base_url="${XAI_BASE_URL:-https://api.x.ai/v1}"
	local daily="${XAI_MODEL_DAILY:-grok-4.3}"
	local reasoning="${XAI_MODEL_REASONING:-grok-4.6}"
	local models_file="${HOME}/.pi/agent/models.json"

	mkdir -p "$(dirname "${models_file}")"
	python3 - "${models_file}" "${base_url}" "${daily}" "${reasoning}" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
base_url, daily, reasoning = sys.argv[2:5]
data = {}
if path.exists():
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError:
        data = {}

models = []
seen = set()
for model_id, label, context_window in (
    (daily, "daily", 1_000_000),
    (reasoning, "reasoning", 500_000),
):
    if model_id in seen:
        continue
    seen.add(model_id)
    models.append({
        "id": model_id,
        "name": f"{model_id} ({label})",
        "reasoning": True,
        "input": ["text", "image"],
        "contextWindow": context_window,
        "maxTokens": 131_072,
    })

providers = data.setdefault("providers", {})
providers["xai-grok"] = {
    "baseUrl": base_url,
    "api": "openai-completions",
    "apiKey": "$XAI_API_KEY",
    "compat": {"supportsDeveloperRole": False, "supportsReasoningEffort": True},
    "models": models,
}
path.write_text(json.dumps(data, indent=2) + "\n")
PY
}

function pi-xai() {
	_require_agent_env XAI_API_KEY || return 1
	_require_agent_command pi || return 1
	_pi_sync_xai_config || return 1
	local daily="${XAI_MODEL_DAILY:-grok-4.3}"
	local reasoning="${XAI_MODEL_REASONING:-grok-4.6}"
	local default_model="${XAI_DEFAULT_MODEL:-${daily}}"
	local models_cycle="xai-grok/${daily}"
	if [[ "${daily}" != "${reasoning}" ]]; then
		models_cycle+=",xai-grok/${reasoning}"
	fi
	print.success "Starting Pi with xAI Grok (${default_model}) in full permissions mode (--approve)..."
	XAI_API_KEY="${XAI_API_KEY}" pi --approve --provider xai-grok --model "${default_model}" --models "${models_cycle}" "$@"
}

function pi-azure() {
	_require_agent_env AZURE_OPENAI_API_KEY || return 1
	print.success "Starting Pi with Azure OpenAI in full permissions mode (--approve)..."
	AZURE_OPENAI_API_KEY="${AZURE_OPENAI_API_KEY}" pi --approve --provider azure-foundry "$@"
}

function pi-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	print.success "Starting Pi with Z.AI GLM in full permissions mode (--approve)..."
	ZAI_CODING_API_KEY="${ZAI_CODING_API_KEY}" pi --approve --provider zai-glm "$@"
}

function clinex() {
	print.success "Starting Cline with full permissions mode (--yolo)..."
	cline --yolo "$@"
}

function _cline_sync_xai_auth() {
	local base_url="${XAI_BASE_URL:-https://api.x.ai/v1}"
	local default_model="${XAI_DEFAULT_MODEL:-${XAI_MODEL_DAILY:-grok-4.3}}"

	print.success "Syncing Cline xAI auth (${default_model} → ${base_url})..."
	cline auth \
		-p openai \
		-b "${base_url}" \
		-k "${XAI_API_KEY}" \
		-m "${default_model}" || return 1
}

function cline-xai() {
	_require_agent_env XAI_API_KEY || return 1
	_require_agent_command cline || return 1
	_cline_sync_xai_auth || return 1
	local default_model="${XAI_DEFAULT_MODEL:-${XAI_MODEL_DAILY:-grok-4.3}}"
	print.success "Starting Cline with xAI Grok (${default_model}) in full permissions mode (--yolo)..."
	cline --yolo -P openai -m "${default_model}" -k "${XAI_API_KEY}" "$@"
}

function _cline_sync_azure_auth() {
	local resource="${AZURE_OPENAI_RESOURCE:-}"
	local base_url="${AZURE_OPENAI_BASE_URL:-}"
	local default_model="${AZURE_OPENAI_DEFAULT_MODEL:-${AZURE_OPENAI_MODEL_DAILY:-gpt-5.4-mini-azure}}"

	if [[ -z "${base_url}" && -n "${resource}" ]]; then
		base_url="https://${resource}.services.ai.azure.com/openai/v1"
	fi
	if [[ -z "${base_url}" ]]; then
		print.error "AZURE_OPENAI_RESOURCE or AZURE_OPENAI_BASE_URL is required."
		return 1
	fi

	print.success "Syncing Cline Azure auth (${default_model} → ${base_url})..."
	cline auth \
		--provider openai \
		--apikey "${AZURE_OPENAI_API_KEY}" \
		--modelid "${default_model}" \
		--baseurl "${base_url}" || return 1
}

function cline-azure() {
	_require_agent_env AZURE_OPENAI_API_KEY || return 1
	_require_agent_command cline || return 1
	_cline_sync_azure_auth || return 1
	local daily="${AZURE_OPENAI_MODEL_DAILY:-gpt-5.4-mini-azure}"
	local default_model="${AZURE_OPENAI_DEFAULT_MODEL:-${daily}}"
	print.success "Starting Cline with Azure OpenAI (${default_model}) in full permissions mode (--yolo)..."
	cline --yolo -P openai -m "${default_model}" -k "${AZURE_OPENAI_API_KEY}" "$@"
}

function clinex-azure() {
	cline-azure "$@"
}

function cline-glm() {
	_require_agent_env ZAI_CODING_API_KEY || return 1
	print.success "Starting Cline with Z.AI GLM in full permissions mode (--yolo)..."
	cline --yolo -P openai -k "${ZAI_CODING_API_KEY}" "$@"
}

function clinex-glm() {
	case "${1:-}" in
		-c|--continue) shift; cline-glm --continue "$@" ;;
		*) cline-glm "$@" ;;
	esac
}

# ================================
# SSH access to this container
# ================================
# sshd is configured and started by docker/local/pertechtalks/entrypoint.sh and
# published on the host port declared in docker-compose.yaml. Handy for driving
# Herdr and the coding agents from another machine — or from a phone.
function sshinfo() {
	local port="${SSH_SERVER_PORT:-22030}"

	if pgrep -x sshd >/dev/null 2>&1; then
		print.success "sshd is running on port ${port}"
	else
		print.error "sshd is NOT running (set SSH_SERVER_ENABLED=true and restart the container)"
	fi

	echo ""
	echo "Connect from the machine running Docker:"
	echo "  ssh -p ${port} node@localhost"
	echo "From another device on the LAN, use the Docker host's IP instead of localhost."
	echo ""
	if [[ -f "${HOME}/.ssh/authorized_keys" ]]; then
		echo "Authorized keys ($(wc -l < "${HOME}/.ssh/authorized_keys")):"
		awk '{ print "  • " $1 " " ($3 ? $3 : "(no comment)") }' "${HOME}/.ssh/authorized_keys"
	else
		print.error "No ~/.ssh/authorized_keys — add SSH_AUTHORIZED_KEYS or SSH_NODE_PASSWORD to docker/local/pertechtalks/.env"
	fi
	echo ""
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
    echo "  • sshinfo              - SSH access details for this container"
    echo ""
    echo "AI Assistant commands (all support -c / --continue where applicable):"
    echo "  Grok / xAI:"
    echo "    grokx, opencode-xai, cline-xai, pix, codex-xai, claude-xai, pi-xai"
    echo "  Claude Code:"
    echo "    claude, claudex, claude-glm, claudex-glm, cline-glm, clinex-glm"
    echo "  Codex:"
    echo "    codex, codexx, codex-azure, codex-glm, codex-xai"
    echo "  OpenCode:"
    echo "    opencode, opencodex, opencode-azure, opencode-glm, opencode-xai"
    echo "  Pi (pix is the recommended full-permissions command):"
    echo "    pi, pix, pi-azure, pi-glm, pi-xai"
    echo "  Cline:"
    echo "    cline, clinex, cline-azure, clinex-azure, cline-xai, cline-glm, clinex-glm"
    echo "  Other:"
    echo "    herdr, chelper, agent, cursorx, dailybot"
    echo ""
    echo "Full-permissions aliases use: Codex --dangerously-bypass-approvals-and-sandbox,"
    echo "Claude --dangerously-skip-permissions, OpenCode --auto, Cline --yolo, Pi --approve."
    echo ""
    echo "  • codexx            - Codex with full permissions (bypass approvals and sandbox)"
    echo "      -c, --continue  Continue most recent session"
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
