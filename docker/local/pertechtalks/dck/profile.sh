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
