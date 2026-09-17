#!/bin/bash

# Setup Claude CLI persistence with symlinks for a given user
# This ensures Claude config persists across container rebuilds
setup_claude_persistence_for_user() {
    USER_HOME="$1"
    CLAUDE_DATA_DIR="${USER_HOME}/.claude_data"
    CLAUDE_JSON="${USER_HOME}/.claude.json"
    CLAUDE_DIR="${USER_HOME}/.claude"
    CLAUDE_JSON_BACKUP="${USER_HOME}/.claude.json.backup"

    # Ensure the persistent data directory exists
    mkdir -p "${CLAUDE_DATA_DIR}"

    # Handle .claude.json file
    if [ ! -L "${CLAUDE_JSON}" ]; then
        # If it's a real file, move it to the persistent volume (only if volume is empty)
        if [ -f "${CLAUDE_JSON}" ]; then
            # Only copy if persistent file doesn't exist (preserve existing data)
            if [ ! -f "${CLAUDE_DATA_DIR}/claude.json" ]; then
                cp "${CLAUDE_JSON}" "${CLAUDE_DATA_DIR}/claude.json"
                echo "  → Copied .claude.json to persistent volume"
            else
                echo "  → Preserving existing .claude.json from persistent volume"
            fi
            rm "${CLAUDE_JSON}"
        fi
        # Ensure target file exists (some apps don't follow symlinks to non-existent files)
        touch "${CLAUDE_DATA_DIR}/claude.json"
        # Create symlink
        ln -sf "${CLAUDE_DATA_DIR}/claude.json" "${CLAUDE_JSON}"
        echo "  → Created symlink for .claude.json"
    fi

    # Handle .claude directory
    if [ ! -L "${CLAUDE_DIR}" ]; then
        # If it's a real directory, move it to the persistent volume
        if [ -d "${CLAUDE_DIR}" ]; then
            # Only copy if persistent directory is empty or doesn't exist
            if [ ! -d "${CLAUDE_DATA_DIR}/claude_dir" ] || [ -z "$(ls -A "${CLAUDE_DATA_DIR}/claude_dir" 2>/dev/null)" ]; then
                cp -r "${CLAUDE_DIR}" "${CLAUDE_DATA_DIR}/claude_dir"
            fi
            rm -rf "${CLAUDE_DIR}"
        else
            mkdir -p "${CLAUDE_DATA_DIR}/claude_dir"
        fi
        # Create symlink
        ln -sf "${CLAUDE_DATA_DIR}/claude_dir" "${CLAUDE_DIR}"
    fi

    # Handle .claude.json.backup file if exists
    if [ -f "${CLAUDE_JSON_BACKUP}" ] && [ ! -L "${CLAUDE_JSON_BACKUP}" ]; then
        if [ ! -f "${CLAUDE_DATA_DIR}/claude.json.backup" ]; then
            cp "${CLAUDE_JSON_BACKUP}" "${CLAUDE_DATA_DIR}/claude.json.backup"
        fi
        rm "${CLAUDE_JSON_BACKUP}"
        ln -sf "${CLAUDE_DATA_DIR}/claude.json.backup" "${CLAUDE_JSON_BACKUP}"
    fi

    # Handle .config/claude-code directory (auth tokens from native installer)
    CLAUDE_CONFIG_DIR="${USER_HOME}/.config/claude-code"
    mkdir -p "${USER_HOME}/.config"
    if [ ! -L "${CLAUDE_CONFIG_DIR}" ]; then
        if [ -d "${CLAUDE_CONFIG_DIR}" ]; then
            # Only seed from image if volume has no existing data
            if [ ! -d "${CLAUDE_DATA_DIR}/config_claude_code" ] || [ -z "$(ls -A "${CLAUDE_DATA_DIR}/config_claude_code" 2>/dev/null)" ]; then
                cp -r "${CLAUDE_CONFIG_DIR}" "${CLAUDE_DATA_DIR}/config_claude_code"
            fi
            rm -rf "${CLAUDE_CONFIG_DIR}"
        else
            mkdir -p "${CLAUDE_DATA_DIR}/config_claude_code"
        fi
        ln -sf "${CLAUDE_DATA_DIR}/config_claude_code" "${CLAUDE_CONFIG_DIR}"
    fi

    echo "Claude CLI persistence setup complete for ${USER_HOME}"
}

# Setup Claude persistence for node user
setup_claude_persistence_for_user "/home/node"
chown -R node:node /home/node/.claude_data /home/node/.claude.json /home/node/.claude /home/node/.config/claude-code 2>/dev/null || true

# Setup Codex CLI persistence with symlinks for a given user
# This ensures OpenAI Codex config persists across container rebuilds
setup_codex_persistence_for_user() {
    USER_HOME="$1"
    CODEX_DATA_DIR="${USER_HOME}/.codex_data"
    CODEX_DIR="${USER_HOME}/.codex"

    # Ensure the persistent data directory exists
    mkdir -p "${CODEX_DATA_DIR}"

    # Handle .codex directory
    if [ ! -L "${CODEX_DIR}" ]; then
        # If it's a real directory, move it to the persistent volume
        if [ -d "${CODEX_DIR}" ]; then
            # Only copy if persistent directory is empty or doesn't exist
            if [ ! -d "${CODEX_DATA_DIR}/codex_dir" ] || [ -z "$(ls -A "${CODEX_DATA_DIR}/codex_dir" 2>/dev/null)" ]; then
                cp -r "${CODEX_DIR}" "${CODEX_DATA_DIR}/codex_dir"
            fi
            rm -rf "${CODEX_DIR}"
        else
            mkdir -p "${CODEX_DATA_DIR}/codex_dir"
        fi
        # Create symlink
        ln -sf "${CODEX_DATA_DIR}/codex_dir" "${CODEX_DIR}"
    fi
}

# Setup Codex persistence for node user
setup_codex_persistence_for_user "/home/node"
chown -R node:node /home/node/.codex_data /home/node/.codex 2>/dev/null || true

# Setup Cursor CLI persistence with symlinks for a given user
# This ensures Cursor CLI config persists across container rebuilds
# Cursor stores data in two locations:
#   - ~/.cursor (CLI config, chats, projects)
#   - ~/.config/cursor (auth tokens - accessToken, refreshToken)
setup_cursor_persistence_for_user() {
    USER_HOME="$1"
    CURSOR_DATA_DIR="${USER_HOME}/.cursor_data"
    CURSOR_DIR="${USER_HOME}/.cursor"
    CURSOR_CONFIG_DIR="${USER_HOME}/.config/cursor"

    # Ensure the persistent data directory exists
    mkdir -p "${CURSOR_DATA_DIR}"

    # Handle .cursor directory (CLI config, chats, projects)
    if [ ! -L "${CURSOR_DIR}" ]; then
        # If it's a real directory, move it to the persistent volume
        if [ -d "${CURSOR_DIR}" ]; then
            # Only copy if persistent directory is empty or doesn't exist (PRESERVE existing data!)
            if [ ! -d "${CURSOR_DATA_DIR}/cursor_dir" ] || [ -z "$(ls -A "${CURSOR_DATA_DIR}/cursor_dir" 2>/dev/null)" ]; then
                echo "  → First run: copying fresh Cursor CLI to persistent volume"
                cp -r "${CURSOR_DIR}" "${CURSOR_DATA_DIR}/cursor_dir"
            else
                echo "  → Preserving existing Cursor CLI data from persistent volume"
            fi
            rm -rf "${CURSOR_DIR}"
        else
            mkdir -p "${CURSOR_DATA_DIR}/cursor_dir"
        fi
        # Create symlink
        ln -sf "${CURSOR_DATA_DIR}/cursor_dir" "${CURSOR_DIR}"
    fi

    # Handle .config/cursor directory (auth tokens)
    mkdir -p "${USER_HOME}/.config"
    if [ ! -L "${CURSOR_CONFIG_DIR}" ]; then
        # If it's a real directory, move it to the persistent volume
        if [ -d "${CURSOR_CONFIG_DIR}" ]; then
            # Only copy if persistent directory is empty or doesn't exist (PRESERVE existing data!)
            if [ ! -d "${CURSOR_DATA_DIR}/config_cursor" ] || [ -z "$(ls -A "${CURSOR_DATA_DIR}/config_cursor" 2>/dev/null)" ]; then
                echo "  → First run: copying fresh Cursor config to persistent volume"
                cp -r "${CURSOR_CONFIG_DIR}" "${CURSOR_DATA_DIR}/config_cursor"
            else
                echo "  → Preserving existing Cursor config from persistent volume"
            fi
            rm -rf "${CURSOR_CONFIG_DIR}"
        else
            mkdir -p "${CURSOR_DATA_DIR}/config_cursor"
        fi
        ln -sf "${CURSOR_DATA_DIR}/config_cursor" "${CURSOR_CONFIG_DIR}"
    fi
}

# Setup Cursor persistence for node user
setup_cursor_persistence_for_user "/home/node"
chown -R node:node /home/node/.cursor_data /home/node/.cursor /home/node/.config 2>/dev/null || true

# Setup GitHub CLI persistence with symlinks for a given user
# This ensures gh config persists across container rebuilds
setup_gh_persistence_for_user() {
    USER_HOME="$1"
    GH_DATA_DIR="${USER_HOME}/.gh_data"
    GH_CONFIG_DIR="${USER_HOME}/.config/gh"

    # Ensure the persistent data directory exists
    mkdir -p "${GH_DATA_DIR}"

    # Handle .config/gh directory
    if [ ! -L "${GH_CONFIG_DIR}" ]; then
        # Create parent directory if needed
        mkdir -p "${USER_HOME}/.config"

        # If it's a real directory, move it to the persistent volume
        if [ -d "${GH_CONFIG_DIR}" ]; then
            # Only copy if persistent directory is empty or doesn't exist
            if [ ! -d "${GH_DATA_DIR}/gh_dir" ] || [ -z "$(ls -A "${GH_DATA_DIR}/gh_dir" 2>/dev/null)" ]; then
                cp -r "${GH_CONFIG_DIR}" "${GH_DATA_DIR}/gh_dir"
            fi
            rm -rf "${GH_CONFIG_DIR}"
        else
            mkdir -p "${GH_DATA_DIR}/gh_dir"
        fi
        # Create symlink
        ln -sf "${GH_DATA_DIR}/gh_dir" "${GH_CONFIG_DIR}"
    fi
}

# Setup GitHub CLI persistence for node user
setup_gh_persistence_for_user "/home/node"
chown -R node:node /home/node/.gh_data /home/node/.config 2>/dev/null || true

# Setup Dailybot CLI persistence with symlinks for a given user.
# The CLI stores credentials/config under ~/.config/dailybot (see dailybot_cli.config.CONFIG_DIR).
# We symlink that path into the named volume at ~/.dailybot_data so login/API keys survive rebuilds.
setup_dailybot_persistence_for_user() {
    USER_HOME="$1"
    DAILYBOT_DATA_DIR="${USER_HOME}/.dailybot_data"
    DAILYBOT_CONFIG_DIR="${USER_HOME}/.config/dailybot"

    mkdir -p "${DAILYBOT_DATA_DIR}"
    mkdir -p "${USER_HOME}/.config"

    if [ ! -L "${DAILYBOT_CONFIG_DIR}" ]; then
        if [ -d "${DAILYBOT_CONFIG_DIR}" ]; then
            # Only seed from image if the volume has no existing data (preserve login)
            if [ ! -d "${DAILYBOT_DATA_DIR}/config_dailybot" ] || [ -z "$(ls -A "${DAILYBOT_DATA_DIR}/config_dailybot" 2>/dev/null)" ]; then
                echo "  → First run: copying fresh Dailybot config to persistent volume"
                cp -r "${DAILYBOT_CONFIG_DIR}" "${DAILYBOT_DATA_DIR}/config_dailybot"
            else
                echo "  → Preserving existing Dailybot config from persistent volume"
            fi
            rm -rf "${DAILYBOT_CONFIG_DIR}"
        else
            mkdir -p "${DAILYBOT_DATA_DIR}/config_dailybot"
        fi
        ln -sf "${DAILYBOT_DATA_DIR}/config_dailybot" "${DAILYBOT_CONFIG_DIR}"
        echo "  → Created symlink for ~/.config/dailybot"
    fi

    echo "Dailybot CLI persistence setup complete for ${USER_HOME}"
}

# Setup Dailybot persistence for node user
setup_dailybot_persistence_for_user "/home/node"
chown -R node:node /home/node/.dailybot_data /home/node/.config/dailybot 2>/dev/null || true

# Setup Z.AI Coding Tool Helper persistence (@z_ai/coding-helper → ~/.chelper)
setup_chelper_persistence_for_user() {
    USER_HOME="$1"
    CHELPER_DATA_DIR="${USER_HOME}/.chelper_data"
    CHELPER_DIR="${USER_HOME}/.chelper"

    mkdir -p "${CHELPER_DATA_DIR}"

    if [ ! -L "${CHELPER_DIR}" ]; then
        if [ -d "${CHELPER_DIR}" ]; then
            if [ ! -d "${CHELPER_DATA_DIR}/chelper_dir" ] || [ -z "$(ls -A "${CHELPER_DATA_DIR}/chelper_dir" 2>/dev/null)" ]; then
                cp -r "${CHELPER_DIR}" "${CHELPER_DATA_DIR}/chelper_dir"
            fi
            rm -rf "${CHELPER_DIR}"
        else
            mkdir -p "${CHELPER_DATA_DIR}/chelper_dir"
        fi
        ln -sf "${CHELPER_DATA_DIR}/chelper_dir" "${CHELPER_DIR}"
    fi
}

setup_chelper_persistence_for_user "/home/node"
chown -R node:node /home/node/.chelper_data /home/node/.chelper 2>/dev/null || true

# OpenCode: ~/.config/opencode + ~/.local/share/opencode
setup_opencode_persistence_for_user() {
    USER_HOME="$1"
    OPENCODE_DATA_DIR="${USER_HOME}/.opencode_data"
    OPENCODE_CONFIG_DIR="${USER_HOME}/.config/opencode"
    OPENCODE_SHARE_DIR="${USER_HOME}/.local/share/opencode"

    mkdir -p "${OPENCODE_DATA_DIR}"
    mkdir -p "${USER_HOME}/.config"
    mkdir -p "${USER_HOME}/.local/share"

    if [ ! -L "${OPENCODE_CONFIG_DIR}" ]; then
        if [ -d "${OPENCODE_CONFIG_DIR}" ]; then
            if [ ! -d "${OPENCODE_DATA_DIR}/config_opencode" ] || [ -z "$(ls -A "${OPENCODE_DATA_DIR}/config_opencode" 2>/dev/null)" ]; then
                cp -r "${OPENCODE_CONFIG_DIR}" "${OPENCODE_DATA_DIR}/config_opencode"
            fi
            rm -rf "${OPENCODE_CONFIG_DIR}"
        else
            mkdir -p "${OPENCODE_DATA_DIR}/config_opencode"
        fi
        ln -sf "${OPENCODE_DATA_DIR}/config_opencode" "${OPENCODE_CONFIG_DIR}"
    fi

    if [ ! -L "${OPENCODE_SHARE_DIR}" ]; then
        if [ -d "${OPENCODE_SHARE_DIR}" ]; then
            if [ ! -d "${OPENCODE_DATA_DIR}/share_opencode" ] || [ -z "$(ls -A "${OPENCODE_DATA_DIR}/share_opencode" 2>/dev/null)" ]; then
                cp -r "${OPENCODE_SHARE_DIR}" "${OPENCODE_DATA_DIR}/share_opencode"
            fi
            rm -rf "${OPENCODE_SHARE_DIR}"
        else
            mkdir -p "${OPENCODE_DATA_DIR}/share_opencode"
        fi
        ln -sf "${OPENCODE_DATA_DIR}/share_opencode" "${OPENCODE_SHARE_DIR}"
    fi
}

setup_opencode_persistence_for_user "/home/node"
chown -R node:node /home/node/.opencode_data /home/node/.config/opencode /home/node/.local/share/opencode 2>/dev/null || true

# Persist Pi, Cline, Herdr and Grok sessions/configuration across container
# rebuilds. Each CLI keeps its state under a single user-home directory, so one
# generic helper covers all of them.
setup_agent_directory_persistence_for_user() {
    USER_HOME="$1"
    DATA_DIR="$2"
    TARGET_DIR="$3"

    mkdir -p "${DATA_DIR}"
    mkdir -p "$(dirname "${TARGET_DIR}")"
    if [ ! -L "${TARGET_DIR}" ]; then
        if [ -d "${TARGET_DIR}" ]; then
            if [ ! -d "${DATA_DIR}/content" ] || [ -z "$(ls -A "${DATA_DIR}/content" 2>/dev/null)" ]; then
                cp -r "${TARGET_DIR}" "${DATA_DIR}/content"
            fi
            rm -rf "${TARGET_DIR}"
        else
            mkdir -p "${DATA_DIR}/content"
        fi
        ln -sf "${DATA_DIR}/content" "${TARGET_DIR}"
    fi
}

setup_agent_directory_persistence_for_user "/home/node" "/home/node/.pi_data" "/home/node/.pi"
setup_agent_directory_persistence_for_user "/home/node" "/home/node/.cline_data" "/home/node/.cline"
setup_agent_directory_persistence_for_user "/home/node" "/home/node/.herdr_data" "/home/node/.config/herdr"
setup_agent_directory_persistence_for_user "/home/node" "/home/node/.grok_data" "/home/node/.grok"
chown -R node:node /home/node/.pi_data /home/node/.pi /home/node/.cline_data /home/node/.cline 2>/dev/null || true
chown -R node:node /home/node/.herdr_data /home/node/.config/herdr /home/node/.grok_data /home/node/.grok 2>/dev/null || true

# Setup SSH keys from host with correct permissions for a given user
# This allows git operations with GitHub/GitLab
setup_ssh_keys_for_user() {
    USER_HOME="$1"
    SSH_HOST_DIR="${USER_HOME}/.ssh_host"
    SSH_DIR="${USER_HOME}/.ssh"

    # Only setup if host SSH directory is mounted
    if [ -d "${SSH_HOST_DIR}" ]; then
        # Create SSH directory if it doesn't exist
        mkdir -p "${SSH_DIR}"

        # Check if SSH keys already exist in container
        KEYS_EXIST=false
        if [ -f "${SSH_DIR}/id_rsa" ] || [ -f "${SSH_DIR}/id_ed25519" ] || [ -f "${SSH_DIR}/id_ecdsa" ]; then
            KEYS_EXIST=true
        fi

        # Only copy if keys don't exist yet (to avoid overwriting persistent volume)
        if [ "$KEYS_EXIST" = false ]; then
            echo "Setting up SSH keys from host for ${USER_HOME}..."

            # Copy ALL private keys from host (id_rsa, id_ed25519, id_ecdsa, named keys, etc.)
            for key_file in "${SSH_HOST_DIR}"/id_*; do
                if [ -f "$key_file" ]; then
                    key_name=$(basename "$key_file")
                    # Skip public keys (*.pub)
                    if [[ "$key_name" != *.pub ]]; then
                        cp "$key_file" "${SSH_DIR}/$key_name"
                        chmod 600 "${SSH_DIR}/$key_name"
                        echo "  ✓ Copied $key_name"
                    fi
                fi
            done

            # Copy public keys
            cp "${SSH_HOST_DIR}"/*.pub "${SSH_DIR}/" 2>/dev/null || true

            # Copy config if exists
            if [ -f "${SSH_HOST_DIR}/config" ]; then
                cp "${SSH_HOST_DIR}/config" "${SSH_DIR}/config"
                chmod 600 "${SSH_DIR}/config"
                echo "  ✓ Copied SSH config"
            fi

            # Copy known_hosts if exists (git can write to it)
            if [ -f "${SSH_HOST_DIR}/known_hosts" ]; then
                cp "${SSH_HOST_DIR}/known_hosts" "${SSH_DIR}/known_hosts"
                echo "  ✓ Copied known_hosts"
            fi

            echo "SSH keys setup completed for ${USER_HOME}"
        fi

        # Always ensure correct permissions (even if keys already existed)
        chmod 700 "${SSH_DIR}" 2>/dev/null || true
        chmod 600 "${SSH_DIR}"/id_* 2>/dev/null || true
        chmod 600 "${SSH_DIR}/config" 2>/dev/null || true
    fi
}

# Setup SSH keys for node user
setup_ssh_keys_for_user "/home/node"
chown -R node:node /home/node/.ssh 2>/dev/null || true

# Setup Node.js specific configurations
setup_nodejs() {
    PNPM_STORE_DIR="/home/node/.local/share/pnpm/store"
    PNPM_CACHE_DIR="/home/node/.cache/pnpm"
    PNPM_CONFIG_DIR="/home/node/.config/pnpm"

    # The project is a bind mount served by Docker Desktop's `fakeowner` layer.
    # pnpm's content-addressable store hardlinks every package into the virtual
    # store (files routinely carry 40+ links), and that layer cannot service
    # those metadata operations — installs die with
    #   ERR_PNPM_EPERM  EPERM: operation not permitted, stat '/app/.pnpm-store/...'
    # So the store has to live on a real container filesystem. Left to itself
    # pnpm picks a store on the project's own drive, which is exactly the
    # broken case, and it must be pinned explicitly.
    #
    # Pin it through pnpm's config file: pnpm 11 reads `storeDir` ONLY from
    # ~/.config/pnpm/config.yaml. `store-dir` in .npmrc and the
    # NPM_CONFIG_STORE_DIR / npm_config_store_dir env vars are all ignored.
    # This is deliberately written outside the repo so CI and host installs,
    # where these paths do not exist, keep their own defaults.
    #
    # Both directories are backed by named volumes (see docker-compose.yaml) so
    # a container rebuild does not re-download every package.
    mkdir -p "${PNPM_STORE_DIR}" "${PNPM_CACHE_DIR}" "${PNPM_CONFIG_DIR}"
    cat > "${PNPM_CONFIG_DIR}/config.yaml" <<EOF
# Generated by entrypoint.sh on container start — edit it there, not here.
storeDir: ${PNPM_STORE_DIR}
cacheDir: ${PNPM_CACHE_DIR}
EOF

    # Named volumes are created root-owned on first mount; the node user has to
    # own them or the very first install fails on a permission error.
    chown -R node:node \
        /home/node/.local/share/pnpm \
        "${PNPM_CACHE_DIR}" \
        "${PNPM_CONFIG_DIR}" 2>/dev/null || true

    # node_modules is intentionally NOT a named volume: mounting a volume there
    # would make the directory a mount point, and `rm -rf node_modules` inside
    # the container would fail with "device or resource busy". It stays on the
    # bind mount, which works now that the store no longer does.
    echo "pnpm store: ${PNPM_STORE_DIR} (off the /app bind mount)"
}

# Setup Git configuration (simplified - main config is in Dockerfile)
setup_git() {
    # Check if git configuration is mounted from host
    if [ -f "/home/node/.gitconfig" ]; then
        echo "Git configuration found and mounted from host"
    else
        echo "Using default Git configuration from Dockerfile"
    fi
}

# Upgrade Dailybot CLI to latest version (non-blocking, best-effort).
# Uses pipx --global (same as Dockerfile) so the node user keeps access.
upgrade_dailybot_cli() {
    if command -v pipx >/dev/null 2>&1; then
        pipx upgrade --global dailybot-cli 2>/dev/null || true
    fi

    local version
    version=$(dailybot --version 2>/dev/null || echo "unknown")
    echo "Dailybot CLI: $version"
}

# Snapshot the container environment for SSH sessions.
# `docker compose` hands env_file/environment variables to PID 1 only. A shell
# started by sshd is a fresh login session and would otherwise see none of them
# — no ZAI_CODING_API_KEY, no XAI_API_KEY, not even the image's PATH — so every
# provider wrapper in docker/custom_commands.sh would report a missing key.
# Writing the snapshot into /etc/profile.d gives an `ssh` session exactly what
# `docker compose exec` sees. Regenerated on every container start.
CONTAINER_ENV_PROFILE=/etc/profile.d/01-container-env.sh

write_container_env_profile() {
    local out="${CONTAINER_ENV_PROFILE}"

    if ! command -v python3 >/dev/null 2>&1; then
        echo "env snapshot: python3 unavailable — ssh sessions will not inherit compose env"
        return 0
    fi

    python3 - "${out}" <<'PY' || return 0
import os
import shlex
import sys

out = sys.argv[1]
# Per-session values that must never be frozen into a login shell.
deny = {
    "HOME", "PWD", "OLDPWD", "SHLVL", "_", "USER", "LOGNAME", "MAIL", "SHELL",
    "TERM", "HOSTNAME", "LS_COLORS", "SSH_CLIENT", "SSH_CONNECTION", "SSH_TTY",
}
lines = [
    "# Generated by entrypoint.sh on container start - edit it there, not here.",
    "# Mirrors the environment docker compose gives PID 1 into login shells (ssh).",
]
for key in sorted(os.environ):
    if key in deny or not key.replace("_", "").isalnum():
        continue
    lines.append("export %s=%s" % (key, shlex.quote(os.environ[key])))
with open(out, "w", encoding="utf-8") as handle:
    handle.write("\n".join(lines) + "\n")
PY

    # The snapshot carries API keys, so keep it off world-readable mode while
    # still letting the node user's login shell read it.
    chown root:node "${out}" 2>/dev/null || true
    chmod 0640 "${out}" 2>/dev/null || true
    echo "env snapshot: ${out} (compose env available to ssh sessions)"
}

# ================================
# OpenSSH server — reach this container from another machine (or a phone)
# ================================
# Published on the host as 22030 (see docker-compose.yaml). Handy for driving
# Herdr and the coding agents remotely: `ssh -p 22030 node@<host>`.
#
# Defaults: key-based auth only, user `node` only, root login refused. Password
# auth is opt-in through SSH_NODE_PASSWORD. Trusted keys come from the host's
# mounted ~/.ssh (its *.pub files and authorized_keys) plus SSH_AUTHORIZED_KEYS.
# Host keys live in the sshd_data named volume, so the container keeps the same
# identity across rebuilds and clients never hit a host-key mismatch warning.
setup_sshd() {
    local enabled="${SSH_SERVER_ENABLED:-true}"
    case "${enabled}" in
        true|1|yes) : ;;
        *) echo "sshd: disabled (SSH_SERVER_ENABLED=${enabled})"; return 0 ;;
    esac

    if [ ! -x /usr/sbin/sshd ]; then
        echo "sshd: openssh-server is not installed — skipping"
        return 0
    fi

    # Keep this in sync with the published port in docker-compose.yaml.
    local port="${SSH_SERVER_PORT:-22030}"
    local key_dir=/etc/ssh/sshd_keys
    local ssh_dir=/home/node/.ssh
    local host_ssh_dir=/home/node/.ssh_host

    mkdir -p /run/sshd "${key_dir}" /etc/ssh/sshd_config.d "${ssh_dir}"

    # Persistent host keys (named volume) instead of the ones the package
    # generated into the image layer, which would differ on every rebuild.
    local key_type
    for key_type in ed25519 rsa; do
        if [ ! -f "${key_dir}/ssh_host_${key_type}_key" ]; then
            ssh-keygen -q -t "${key_type}" -f "${key_dir}/ssh_host_${key_type}_key" -N '' -C "pertechtalks-devcontainer" \
                && echo "  → Generated ${key_type} host key"
        fi
        chmod 600 "${key_dir}/ssh_host_${key_type}_key" 2>/dev/null || true
    done

    # Rebuild authorized_keys from the sources we control, so a key removed at
    # the source stops working here too.
    local tmp_keys
    tmp_keys="$(mktemp)"
    {
        # Whatever the host already trusts for this user.
        [ -f "${host_ssh_dir}/authorized_keys" ] && cat "${host_ssh_dir}/authorized_keys"
        # The host's own public keys: their private half is the key already used
        # for git, so `ssh -p ${port} node@localhost` works with no extra setup.
        local pub
        for pub in "${host_ssh_dir}"/*.pub; do
            [ -f "${pub}" ] && cat "${pub}"
        done
        # Extra keys pasted into the env file (separate several with ';').
        if [ -n "${SSH_AUTHORIZED_KEYS:-}" ]; then
            printf '%s\n' "${SSH_AUTHORIZED_KEYS}" | tr ';' '\n'
        fi
    } 2>/dev/null | grep -E '^(ssh-|ecdsa-|sk-)' | sort -u > "${tmp_keys}"

    if [ -s "${tmp_keys}" ]; then
        install -m 600 -o node -g node "${tmp_keys}" "${ssh_dir}/authorized_keys"
        echo "sshd: $(wc -l < "${ssh_dir}/authorized_keys") authorized key(s) for user node"
    elif [ -f "${ssh_dir}/authorized_keys" ]; then
        echo "sshd: no key source found — keeping the existing authorized_keys"
    else
        echo "sshd: no authorized keys found (mount ~/.ssh, or set SSH_AUTHORIZED_KEYS / SSH_NODE_PASSWORD)"
    fi
    rm -f "${tmp_keys}"
    chmod 700 "${ssh_dir}" 2>/dev/null || true
    chown -R node:node "${ssh_dir}" 2>/dev/null || true

    # `ssh host "cmd"` runs a NON-login shell, which reads neither ~/.bashrc nor
    # /etc/profile.d — so the snapshot above would miss it. ~/.ssh/environment
    # covers those sessions. PermitUserEnvironment below restricts it to
    # provider variables; LD_* deliberately stays out of that list.
    python3 - "${ssh_dir}/environment" <<'PYENV' || true
import os
import sys

out = sys.argv[1]
prefixes = ("ZAI_", "XAI_", "AZURE_", "ANTHROPIC_", "DAILYBOT_", "PUBLIC_", "ASTRO_")
names = ("DOCKER_DEV_ENV", "CHROME_PATH", "CLINE_DATA_DIR", "PNPM_HOME", "EDITOR", "VISUAL", "GIT_EDITOR")
lines = []
for key in sorted(os.environ):
    value = os.environ[key]
    if "\n" in value:
        continue
    if key.startswith(prefixes) or key in names:
        lines.append("%s=%s" % (key, value))
with open(out, "w", encoding="utf-8") as handle:
    handle.write("\n".join(lines) + ("\n" if lines else ""))
PYENV
    # PATH is the one variable sshd always overwrites with its own default, so
    # it cannot be handed over directly. BASH_ENV can: bash sources it in every
    # non-interactive shell, and the snapshot it points at exports the image
    # PATH along with everything else. That is what makes
    # `ssh -p 22030 node@host "codexx -p ..."` resolve the agent CLIs.
    if [ -f "${CONTAINER_ENV_PROFILE}" ]; then
        printf 'BASH_ENV=%s\n' "${CONTAINER_ENV_PROFILE}" >> "${ssh_dir}/environment"
    fi
    chown node:node "${ssh_dir}/environment" 2>/dev/null || true
    chmod 600 "${ssh_dir}/environment" 2>/dev/null || true

    # Password login is opt-in: only when SSH_NODE_PASSWORD carries a value.
    local password_auth=no
    if [ -n "${SSH_NODE_PASSWORD:-}" ]; then
        echo "node:${SSH_NODE_PASSWORD}" | chpasswd
        password_auth=yes
        echo "sshd: password authentication enabled for user node"
    fi

    cat > /etc/ssh/sshd_config.d/10-devcontainer.conf <<EOF
# Generated by entrypoint.sh on container start — edit it there, not here.
Port ${port}
AddressFamily any
ListenAddress 0.0.0.0
HostKey ${key_dir}/ssh_host_ed25519_key
HostKey ${key_dir}/ssh_host_rsa_key
PermitRootLogin no
AllowUsers node
PubkeyAuthentication yes
PasswordAuthentication ${password_auth}
PermitUserEnvironment BASH_ENV,ZAI_*,XAI_*,AZURE_*,ANTHROPIC_*,DAILYBOT_*,PUBLIC_*,ASTRO_*,DOCKER_DEV_ENV,CHROME_PATH,CLINE_DATA_DIR,PNPM_HOME,EDITOR,VISUAL,GIT_EDITOR
KbdInteractiveAuthentication no
PermitEmptyPasswords no
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
ClientAliveInterval 30
ClientAliveCountMax 6
EOF

    # Debian ships `Include /etc/ssh/sshd_config.d/*.conf` at the top of
    # sshd_config; add it if a future base image ever drops it.
    if ! grep -qE '^[[:space:]]*Include[[:space:]]+/etc/ssh/sshd_config\.d/\*\.conf' /etc/ssh/sshd_config 2>/dev/null; then
        printf 'Include /etc/ssh/sshd_config.d/*.conf\n' | cat - /etc/ssh/sshd_config > /etc/ssh/sshd_config.new \
            && mv /etc/ssh/sshd_config.new /etc/ssh/sshd_config
    fi

    # A daemon left over from a previous start would hold the port.
    pkill -x sshd 2>/dev/null || true

    if /usr/sbin/sshd -t; then
        /usr/sbin/sshd
        echo "sshd: listening on ${port} — ssh -p ${port} node@<docker-host>"
    else
        echo "sshd: configuration test failed — not starting"
    fi
}

# Main setup function
main() {
    echo "Starting container setup..."

    # Run all setup functions
    setup_nodejs
    setup_git
    write_container_env_profile
    setup_sshd
    upgrade_dailybot_cli

    echo "Container setup completed"

    # Execute the main command
    exec "$@"
}

# Run main function with all arguments
main "$@"
