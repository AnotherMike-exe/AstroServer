# Quick Reference: AstroServer

> The commands you actually run on this project. Anything that is true of every
> Plum project belongs in the standards, not here.

---

## Daily commands

```bash
# Local site with live reload
npm run dev                      # http://localhost:4321

# Check and build
npm run check
npm run build

# Container
docker compose up -d
docker compose down
docker compose pull && docker compose up -d   # deploy a new image

# Logs
docker logs AstroServer
docker exec AstroServer tail -n 50 /config/logs/error.log

# Regenerate the logos after changing the master vector
python3 scripts/BuildLogos.py Brand/LogoMaster.svg

# Promote dev to a release (linear history, no merge commit)
git checkout main && git pull && git merge --ff-only origin/dev && git push

# Release a pinned version
git tag v0.1.0 && git push origin v0.1.0
```

## Endpoints and ports

| What | Where |
|---|---|
| Site | http://localhost:8080 |
| Health check | http://localhost:8080/healthz |
| Dev server (`npm run dev`) | http://localhost:4321 |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PUID` / `PGID` | `99` / `100` | NGINX workers run as this user; owns `/config` |
| `UMASK` | `002` | Permissions for log files the container creates |
| `TZ` | `UTC` | Log timestamps |
| `DEBUG` | `false` | `true` raises the NGINX error log to `info` |
| `SITE_URL` (build arg) | `https://www.plumsolutions.net` | Public URL for the sitemap and canonical links |

## Paths

| Path | Holds |
|---|---|
| `/config/logs/` | `access.log`, `error.log` |
| `/config/nginx/` | Your `*.conf` additions; `CustomExample.conf.example` shows the shape |
| `/usr/share/nginx/html` | The built site, inside the image |
| `src/content/projects/` | One Markdown file per project |
| `src/content/docs/docs/` | Docs pages, one folder per project |
| `src/styles/Tokens.css` | Brand colours and fonts |

## Image tags

| Tag | From |
|---|---|
| `latest`, `sha-<short>` | every push to `main` (release) |
| `dev`, `sha-<short>` | every push to `dev` (testing) |
| `X.Y.Z`, `X.Y` | a `vX.Y.Z` tag |
| `pr-<number>` | a pull request from this repository, for preview before merge |

## Troubleshooting

### Container will not start after adding a custom config
→ The entrypoint runs `nginx -t`. The container log names the file and line.
→ Fix or remove the file in `/config/nginx/`, then restart.

### Container will not start
→ `docker logs AstroServer` first, then `/config/logs/error.log`
→ Check the port is free: `lsof -i :8080`

### Permission errors on the volumes
→ `PUID`/`PGID` must match the host owner: `id -u`, `id -g`
→ `chown -R [PUID]:[PGID] /mnt/user/appdata/AstroServer`

## Project links

- [Architecture](ARCHITECTURE.md)
- [Dev setup](DEV-SETUP.md)
- [Issues](https://github.com/AnotherMike-exe/AstroServer/issues)

---

**Scope note for whoever edits this file:** naming rules, Binhex conventions,
documentation layout, and the git workflow are Plum-wide standards and live in the
`plum-standards` skill. Do not restate them here — a copy in every repo is a copy
that goes stale.
