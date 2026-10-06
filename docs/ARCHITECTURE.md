# Architecture — AstroServer

How this project is built and why. `README.md` says what it does. This file says what
somebody must understand before they change it.

## Shape

A static website packaged as one container. GitHub Actions runs `astro build`, which
turns the Markdown in `src/content/docs/` into plain HTML, CSS and JS. The image holds
only that output and NGINX. The host (PlumServer, Unraid) pulls the image by tag and
runs it behind a reverse proxy.

## Components

| Component | Does | Built with |
|---|---|---|
| Site source | Pages, projects and docs as Markdown/MDX | Astro 7, Starlight |
| Build stage | Turns the source into static files in `dist/` | `node:24-alpine` |
| Runtime | Serves `dist/` on port 8080 | `nginx:1.30-alpine` |
| Entrypoint | Applies PUID/PGID/UMASK/TZ/DEBUG, prepares `/config` | POSIX sh |
| CI | Checks, builds, smoke-tests and publishes the image | GitHub Actions |

## Data flow

```
edit Markdown -> push to main -> BuildImage.yml -> ghcr.io/anothermike-exe/astro-server
                                                        |
visitor -> reverse proxy (TLS) -> AstroServer:8080 (NGINX) -> /usr/share/nginx/html
```

## Data

| Store | Holds | Lives at | Survives a rebuild |
|---|---|---|---|
| Image | The built site | `/usr/share/nginx/html` | Replaced by design |
| `/config/logs` | `access.log`, `error.log` | volume | Yes |
| `/config/nginx` | Optional `*.conf` additions | volume | Yes |

There is no database. Upgrading means pulling a new tag; nothing migrates.

## External dependencies

| Depends on | For | When it is down |
|---|---|---|
| GHCR | Pulling new images | The running container keeps serving the last image |
| Reverse proxy | TLS and the public hostname | The site is reachable on the LAN port only |

## Deployment

- Image: `ghcr.io/anothermike-exe/astro-server`
- Tags: `latest` and `sha-<short>` from `main`; `X.Y.Z` and `X.Y` from a `vX.Y.Z` tag
- Host: Unraid (PlumServer), pulled by tag, never built there
- Rollback: set the container to the previous `X.Y.Z` or `sha-` tag

## CI/CD and secrets

| Workflow | Triggers on | Does |
|---|---|---|
| `Review.yml` | pull request, push to `main` | `astro check`, build, entrypoint syntax; Claude review on PRs |
| `BuildImage.yml` | pull request, push to `main`, tag `v*` | builds amd64, smoke-tests the container, then pushes amd64+arm64 to GHCR with provenance (not on PRs) |
| Dependabot | weekly | npm, base images and actions |

| Secret / variable | Used by | Still to create |
|---|---|---|
| `GITHUB_TOKEN` | `BuildImage.yml` (GHCR push) | No, built in |
| `ANTHROPIC_API_KEY` (secret) | `Review.yml` | Optional; the review skips without it |
| `SITE_URL` (variable) | `BuildImage.yml` | Yes, once the domain is final |

## Security model

- **Trust boundary**: public. Port 8080 is meant to sit behind a reverse proxy or tunnel
  that terminates TLS. The container serves files only: no server-side code, no admin
  login, no database.
- **Authentication**: none. Everything in the image is public.
- **Secrets at runtime**: none.
- **Runs as**: the NGINX master runs as root to read its config and open logs; the
  worker processes that handle requests run as `PUID`/`PGID`.
- `server_tokens off`, `nosniff`, `SAMEORIGIN` framing and a strict referrer policy are
  set in `nginx/nginx.conf`.

## Known limits

- Static only. Forms, search beyond Pagefind, or a store need another service.
- Every content change is a rebuild and a new image. That is minutes, not seconds.

## Decisions

### Static Astro over a CMS

**Chose**: Astro + Starlight, content in git
**Over**: Payload CMS, WordPress, Ghost
**Because**: no database or admin surface on a public-facing homelab box, docs-as-code
fits the Claude Code workflow, and the image moves to a VPS unchanged.
**Revisit when**: someone other than the maintainer needs to edit content in a browser.

### Astro's official Docker recipe as the base

**Chose**: two-stage build, `node` then `nginx:alpine`, config from the recipe
**Over**: a custom Node server or a third-party image
**Because**: the most upstream-supported path, with the fewest custom parts to maintain.
**Revisit when**: the site needs on-demand rendering; then switch to the recipe's SSR
variant with the Node adapter.

### No supervisord (deliberate exception to the Binhex standard)

**Chose**: NGINX as the single process, logs written to `/config/logs/` and stdout
**Over**: supervisord with `/config/supervisord.log`
**Because**: there is one process, and supervisord on Alpine brings a Python runtime
into a public-facing image for no gain. The other Binhex conventions (PUID, PGID,
UMASK, TZ, DEBUG, `/config`) are kept.
**Revisit when**: a second process joins the container.

### Build in CI, never on the host

**Chose**: GHCR images pulled by tag
**Over**: building on Unraid
**Because**: the host needs no toolchain, every deploy is a named tag, and rollback is
one edit.
**Revisit when**: no plan to.
