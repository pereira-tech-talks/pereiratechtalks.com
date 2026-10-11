# shellcheck shell=sh
# devcontainer-kit: login-shell PATH (Herdr panes and `ssh` sessions are login
# shells, and Debian's /etc/profile resets PATH). User tool directories first.
for _d in "$HOME/.local/bin" "$HOME/.local/share/agentkit/bin" "/usr/local/share/pnpm/bin"; do
  [ -d "$_d" ] || continue
  case ":${PATH}:" in *":${_d}:"*) ;; *) PATH="${_d}:${PATH}" ;; esac
done
unset _d
export PATH
export EDITOR="${EDITOR:-nvim}" VISUAL="${VISUAL:-nvim}" GIT_EDITOR="${GIT_EDITOR:-nvim}"
# The container's own environment for ssh sessions (written by dck_env_profile).
if [ -r "$HOME/.dck/env.sh" ]; then . "$HOME/.dck/env.sh"; fi
# SSH agent. Herdr points SSH_AUTH_SOCK at its forwarded-agent link, which dangles
# ("herdr.sock.unavailable") when the client that attached forwarded no agent; the
# mesh, git and herdr-peers replies then have no key. Fall back to the host agent
# dck mounts for the container's lifetime (ssh_agent = true).
if [ -S /run/dck/ssh-agent.sock ] && { [ -z "${SSH_AUTH_SOCK:-}" ] || [ ! -S "${SSH_AUTH_SOCK}" ]; }; then
  SSH_AUTH_SOCK=/run/dck/ssh-agent.sock
  export SSH_AUTH_SOCK
fi
