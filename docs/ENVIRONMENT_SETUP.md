# Environment setup

Developer and Cloudflare Pages environment variables for Pereira Tech Talks v3.

## Local Docker

Copy `docker/local/pertechtalks/.env.example` → `.env` inside the same directory (or your compose env file). Never commit real secrets.

### pnpm store location (do not move it back into `/app`)

`/app` is a bind mount served by Docker Desktop's `fakeowner` layer. pnpm's content-addressable store hardlinks every package into the virtual store — store files routinely carry 40+ links — and that layer cannot service those metadata operations. With the store inside `/app`, `pnpm install` dies with:

```
ERR_PNPM_EPERM  EPERM: operation not permitted, stat '/app/.pnpm-store/v11/files/...'
```

Left to itself pnpm places the store on the project's own drive, which is exactly the broken case, so `entrypoint.sh` (`setup_nodejs`) pins it:

```yaml
# /home/node/.config/pnpm/config.yaml — regenerated on every container start
storeDir: /home/node/.local/share/pnpm/store
cacheDir: /home/node/.cache/pnpm
```

Both paths are backed by the `pnpm_store` / `pnpm_cache` named volumes (real ext4), so a container rebuild does not re-download the dependency tree.

Two constraints worth knowing before changing any of this:

- **pnpm 11 reads `storeDir` only from `~/.config/pnpm/config.yaml`.** `store-dir` in `.npmrc` and the `NPM_CONFIG_STORE_DIR` / `npm_config_store_dir` env vars are silently ignored. The file lives outside the repo on purpose, so CI and host installs keep their own defaults.
- **`node_modules` is deliberately not a named volume.** Mounting one there would make it a mount point and `rm -rf node_modules` inside the container would fail with "device or resource busy". It stays on the bind mount, which is fine now that the store does not.

Since the store and `node_modules` sit on different filesystems, pnpm copies instead of hardlinking (`Packages are copied from the content-addressable store to the virtual store`). That is expected — a full clean reinstall takes roughly a minute.

Wiping and reinstalling from inside the container is supported at any time:

```bash
rm -rf node_modules && pnpm install
```

## Community intake forms (Dailybot)

| Variable | Required | Notes |
|----------|----------|-------|
| `DAILYBOT_API_KEY` | Yes (Functions) | Personal API key from Dailybot user settings. Server-only. See [FORMS.md](./features/FORMS.md). |
| `PUBLIC_CONTACT_API_ENDPOINT` | Optional | Defaults to `/api/contact` in code. Override only if the Function is mounted elsewhere. |
| `RESEND_API_KEY` | Optional | Submitter ack after Dailybot success |
| `CONTACT_FROM_EMAIL` | Optional with Resend | Verified sender |
| `CONTACT_RATE_LIMIT` / `CONTACT_RATE_WINDOW_MS` | Optional | Defaults 8 / 600000 |
| `CONTACT_ALLOWED_ORIGINS` | Recommended in prod | Comma-separated Origins for CORS (e.g. `https://pereiratechtalks.org`). When empty, the Function reflects the request Origin — tighten for production. |

**Key rotation:** Revoke the key in Dailybot → user settings → API keys, set the new value in Cloudflare Pages secrets (Production + Preview) and local `.env`, redeploy / restart Functions.

**Local Functions:** `pnpm run dev` (Astro) does not execute `functions/`. Use Wrangler Pages Dev against a build output with bindings, or deploy a Preview environment for end-to-end form smoke.

## Analytics

See [ANALYTICS.md](./ANALYTICS.md) for `PUBLIC_UMAMI_*` and Bing verification. Do not add Google site-verification meta tags.
