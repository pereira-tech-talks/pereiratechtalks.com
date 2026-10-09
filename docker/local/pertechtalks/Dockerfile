FROM node:24.21.0-trixie-slim
LABEL maintainer="pereiratechtalks@gmail.com"

# Coding CLIs are opt-in. Only the exact string "true" installs. Flipping one
# flag rebuilds that CLI layer, not this apt layer. herdr stays unconditional.
ARG INSTALL_CLAUDE_CLI=false
ARG INSTALL_CURSOR_CLI=false
ARG INSTALL_CODEX_CLI=false
ARG INSTALL_PI_CLI=false
ARG INSTALL_OPENCODE_CLI=false
ARG INSTALL_CLINE_CLI=false
ARG INSTALL_GROK_CLI=false

# Debian's default CDN (deb.debian.org) resolves to an edge that serves some
# networks at ~55 KB/s; cdn-aws serves the identical archives much faster.
# Override per build when a different mirror is closer:
#   docker compose build --build-arg APT_MIRROR=deb.debian.org
ARG APT_MIRROR=cdn-aws.deb.debian.org
RUN sed -i "s|deb.debian.org|${APT_MIRROR}|g" /etc/apt/sources.list.d/debian.sources

# One Dockerfile RUN owns apt-get update, the image packages, and the clean.
# lua5.4, ripgrep, fd-find, unzip, python3-venv and the C toolchain (gcc,
# make, libc6-dev) plus fontconfig are what DeepWorkPlan Vim's plugins build
# with; its installer runs with --skip-packages, so the image must provide them.
# Host keys are NOT generated here (PRIVATE key must not land in an image
# layer). Do not apt-install neovim as the primary editor — the DeepWorkPlan
# Vim installer puts the pinned release under /home/node/.local.
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y \
      less git curl gnupg ca-certificates openssh-client openssh-server \
      sudo nano python3 python3-pip pipx \
      lua5.4 ripgrep fd-find python3-neovim python3-venv luarocks unzip \
      gcc make libc6-dev fontconfig \
      # Chromium for Lighthouse CI local audits
      chromium && \
    mkdir -p /var/run/sshd /etc/ssh/sshd_config.d && \
    rm -f /etc/ssh/ssh_host_* && \
    printf '%s\n' \
      'PasswordAuthentication no' \
      'PubkeyAuthentication yes' \
      'PermitRootLogin no' \
      'UsePAM yes' \
      'AllowTcpForwarding yes' \
      'AllowStreamLocalForwarding yes' \
      > /etc/ssh/sshd_config.d/herdr.conf && \
    ln -sf "$(command -v fdfind)" /usr/local/bin/fd && \
    ln -sf "$(command -v lua5.4)" /usr/local/bin/lua && \
    apt-get clean -y && \
    rm -rf /var/cache/apk/* && \
    rm -rf /var/lib/apt/lists/*

# Herdr, sshd and the agent CLIs spawn ${SHELL}, falling back to /bin/sh when it
# is unset. Every wrapper in docker/custom_commands.sh is a bash function, so a
# /bin/sh pane reports commands as missing.
ENV SHELL=/bin/bash

# DeepWorkPlan Vim is the terminal editor. ~/.local/bin stays first on PATH below.
ENV EDITOR=nvim
ENV VISUAL=nvim
ENV GIT_EDITOR=nvim

# Chromium path for Lighthouse CI (chrome-launcher)
ENV CHROME_PATH=/usr/bin/chromium
ENV CHROMIUM_FLAGS="--no-sandbox"

# GitHub CLI from the official release tarball (avoids a second apt-get update).
ARG GH_VERSION=2.83.2
RUN GH_ARCH="$(dpkg --print-architecture)" \
    && curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_${GH_ARCH}.tar.gz" -o /tmp/gh.tar.gz \
    && tar -xzf /tmp/gh.tar.gz -C /tmp \
    && install -m 0755 "/tmp/gh_${GH_VERSION}_linux_${GH_ARCH}/bin/gh" /usr/local/bin/gh \
    && rm -rf /tmp/gh.tar.gz "/tmp/gh_${GH_VERSION}_linux_${GH_ARCH}" \
    && gh --version

# Add node user to sudoers (node user already exists in official node images with uid 1000)
RUN echo 'node ALL=(root) NOPASSWD:ALL' > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Enable corepack so pnpm is provisioned from the version pinned in
# package.json's "packageManager" field.
RUN corepack enable

# pnpm global install location. pnpm writes binaries to ${PNPM_HOME}/bin.
ENV PNPM_HOME=/usr/local/share/pnpm
RUN mkdir -p "${PNPM_HOME}/bin" \
    && chown -R node:node "${PNPM_HOME}"

# PATH order:
#   ~/.local/bin first so the installer's pinned Neovim wins
#   pnpm globals next
#   other agent CLI homes
#   then the image default
ENV PATH=/home/node/.local/bin:${PNPM_HOME}/bin:${PNPM_HOME}:/home/node/.cursor/bin:/home/node/.opencode/bin:/home/node/.grok/bin:$PATH
ENV CLINE_DATA_DIR=/home/node/.cline/data

# Ensure the container's image-installed Node (/usr/local/bin) precedes any
# IDE-bundled Node, while ~/.local/bin stays first for nvim.
RUN printf '%s\n' \
    '# Container Node wins over IDE-bundled Node, but ~/.local/bin stays first (pinned nvim).' \
    'if [ -x /usr/local/bin/node ]; then' \
    '  case ":${PATH}:" in' \
    '    ":/usr/local/bin:"*) : ;;' \
    '    *) PATH="/usr/local/bin:${PATH}" ;;' \
    '  esac' \
    'fi' \
    'for d in "/usr/local/share/pnpm/bin" "$HOME/.local/share/pnpm/bin" "$HOME/.local/bin"; do' \
    '  case ":${PATH}:" in' \
    '    *":${d}:"*) ;;' \
    '    *) [ -d "$d" ] && PATH="${d}:${PATH}" ;;' \
    '  esac' \
    'done' \
    'export PATH' \
    > /etc/profile.d/00-container-node-first.sh \
    && chmod 0644 /etc/profile.d/00-container-node-first.sh

# Redirect any `npm` invocation to pnpm — this repo uses pnpm exclusively.
RUN rm -f /usr/local/bin/npm && \
    printf '#!/bin/bash\necho "[npm→pnpm] Redirecting \"npm $*\" to pnpm (this repo uses pnpm)." >&2\nexec corepack pnpm "$@"\n' \
    > /usr/local/bin/npm \
    && chmod +x /usr/local/bin/npm

# Source custom commands for node user
RUN echo 'source /app/docker/custom_commands.sh' >> /home/node/.bashrc \
    && chown node:node /home/node/.bashrc

# An SSH session starts a LOGIN shell; bash login shells read ~/.bash_profile.
RUN printf '%s\n' \
    '# Login shells (ssh) must pick up the interactive config too.' \
    '[ -f "${HOME}/.bashrc" ] && . "${HOME}/.bashrc"' \
    '# Start in the project, mirroring `docker compose exec` (working_dir: /app).' \
    'cd /app 2>/dev/null || true' \
    > /home/node/.bash_profile \
    && chown node:node /home/node/.bash_profile

# Pre-create persistent data dirs so named volumes inherit node ownership.
RUN mkdir -p /home/node/.claude_data /home/node/.codex_data /home/node/.cursor_data /home/node/.gh_data \
    /home/node/.dailybot_data /home/node/.chelper_data /home/node/.opencode_data /home/node/.pi_data \
    /home/node/.cline_data /home/node/.herdr_data /home/node/.grok_data /home/node/.ssh \
    && chown -R node:node /home/node

# Configure Git for node user (can be overridden by mounted .gitconfig)
USER node
RUN git config --global init.defaultBranch main \
    && git config --global pull.rebase false \
    && git config --global safe.directory '*' \
    && git config --global core.editor nvim
USER root

# Each coding CLI is its own RUN and no-ops unless its flag is exactly true.
# A default build does not download claude, cursor, codex, pi, opencode, cline, or grok.
# Redeclare ARG after USER; Docker drops build args at a user change.
USER node
ARG INSTALL_CLAUDE_CLI=false
RUN if [ "$INSTALL_CLAUDE_CLI" = "true" ]; then \
      curl -fsSL https://claude.ai/install.sh | bash \
      && rm -rf /home/node/.claude /home/node/.claude.json; \
    else echo "INSTALL_CLAUDE_CLI is not true; skipping claude"; fi
USER root

USER node
ARG INSTALL_CURSOR_CLI=false
RUN if [ "$INSTALL_CURSOR_CLI" = "true" ]; then \
      curl -fsSL https://cursor.com/install | bash; \
    else echo "INSTALL_CURSOR_CLI is not true; skipping cursor"; fi
USER root
ARG INSTALL_CURSOR_CLI=false
RUN if [ "$INSTALL_CURSOR_CLI" = "true" ]; then \
      ln -sf /home/node/.cursor/bin/agent /usr/local/bin/agent; \
    else echo "INSTALL_CURSOR_CLI is not true; skipping agent symlink"; fi

USER node
ARG INSTALL_OPENCODE_CLI=false
ARG INSTALL_CLINE_CLI=false
ARG INSTALL_PI_CLI=false
ARG INSTALL_CODEX_CLI=false
ARG INSTALL_GROK_CLI=false
RUN if [ "$INSTALL_OPENCODE_CLI" = "true" ]; then \
      curl -fsSL https://opencode.ai/install | bash -s -- --no-modify-path; \
    else echo "INSTALL_OPENCODE_CLI is not true; skipping opencode"; fi
RUN if [ "$INSTALL_CLINE_CLI" = "true" ]; then \
      corepack pnpm add -g cline; \
    else echo "INSTALL_CLINE_CLI is not true; skipping cline"; fi
# Z.AI helper is small and backs the *-glm wrappers when those CLIs are present.
RUN corepack pnpm add -g @z_ai/coding-helper
RUN if [ "$INSTALL_CODEX_CLI" = "true" ]; then \
      corepack pnpm add -g @openai/codex; \
    else echo "INSTALL_CODEX_CLI is not true; skipping codex"; fi
RUN if [ "$INSTALL_PI_CLI" = "true" ]; then \
      corepack pnpm add -g --ignore-scripts @earendil-works/pi-coding-agent; \
    else echo "INSTALL_PI_CLI is not true; skipping pi"; fi
RUN if [ "$INSTALL_GROK_CLI" = "true" ]; then \
      curl -fsSL https://x.ai/cli/install.sh | bash; \
    else echo "INSTALL_GROK_CLI is not true; skipping grok"; fi
# Herdr is the mesh runtime — always installed. The installer caps its binary
# download at --max-time 120; slow GitHub edges need longer. The sed lifts only
# that one cap and leaves SHA-256 verification untouched.
RUN curl -fsSL https://herdr.dev/install.sh | sed 's/--max-time 120/--max-time 1800/' | bash
USER root
# Non-login SSH only sees /usr/local/bin. node cannot write there.
RUN ln -sfn /home/node/.local/bin/herdr /usr/local/bin/herdr
USER node
# Seed nested Herdr so herdr --remote from inside a Herdr pane is allowed.
# Volume-backed herdr_data may already exist; entrypoint patches that case.
RUN mkdir -p /home/node/.config/herdr && \
    if [ ! -f /home/node/.config/herdr/config.toml ]; then \
      printf '%s\n' \
        '[experimental]' \
        'allow_nested = true' \
        > /home/node/.config/herdr/config.toml; \
    fi

# DeepWorkPlan Vim for node, through the hosted installer in container mode:
# --nvim installs the pinned Neovim release (sha256-verified) into
# ~/.local/opt and links it as ~/.local/bin/nvim; --skip-packages relies on the
# apt layer above; --strict fails the build when the headless plugin install
# fails or leaves a required plugin (alpha-nvim, nvim-cmp, mason.nvim) empty.
# Bumping either ARG rebuilds only this layer. pipefail: a failed download must
# fail the build, not feed bash an empty script that exits 0.
USER node
ARG DWP_VIM_VERSION=0.5.0
ARG NVIM_VERSION=0.12.5
RUN bash -o pipefail -c 'curl -fsSL https://vim.deepworkplan.com/install.sh \
    | bash -s -- --version "${DWP_VIM_VERSION}" --nvim "${NVIM_VERSION}" --skip-packages --strict'
USER root

# Dailybot CLI system-wide (pipx already in the single apt layer above).
# Python 3.13+ on Debian Trixie enforces PEP 668; pipx --global puts dailybot
# on PATH for all users (incl. node).
RUN pipx install --global "dailybot-cli>=3.8.0"

# Restore the tool directories that a LOGIN shell loses when Debian's
# /etc/profile overwrites PATH. Appended, never prepended, so ~/.local/bin
# and /usr/local/bin keep their intended order.
RUN printf '%s\n' \
    '# Re-add the tool dirs that Debian'"'"'s /etc/profile drops from PATH.' \
    'export SHELL="${SHELL:-/bin/bash}"' \
    'export PNPM_HOME="${PNPM_HOME:-/usr/local/share/pnpm}"' \
    'for _d in "$HOME/.local/bin" "${PNPM_HOME}/bin" "${PNPM_HOME}" "$HOME/.cursor/bin" "$HOME/.opencode/bin" "$HOME/.grok/bin"; do' \
    '  [ -d "$_d" ] || continue' \
    '  case ":${PATH}:" in' \
    '    *":${_d}:"*) ;;' \
    '    *) PATH="${PATH}:${_d}" ;;' \
    '  esac' \
    'done' \
    'unset _d' \
    'export PATH' \
    > /etc/profile.d/02-container-tool-paths.sh \
    && chmod 0644 /etc/profile.d/02-container-tool-paths.sh

# Copy and setup entrypoint script
COPY pertechtalks/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
