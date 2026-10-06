# AstroServer

> The Plum Solutions website — home page, projects and documentation — as a ready-to-pull container image.

A static site built with [Astro](https://astro.build) and its [Starlight](https://starlight.astro.build)
docs theme, served by NGINX. GitHub Actions builds the site and publishes the image to
GHCR, so the host only pulls a tag: no Node, no build and no database on the server.

---

## Usage

```bash
docker run -d --name AstroServer -p 8080:8080 \
  -e PUID=99 -e PGID=100 -e UMASK=002 -e TZ=America/Los_Angeles \
  -v /mnt/user/appdata/AstroServer:/config \
  ghcr.io/anothermike-exe/astro-server:latest
```

Or `docker compose up -d` with the [docker-compose.yml](docker-compose.yml) in this repo.
On Unraid, add a container with the repository `ghcr.io/anothermike-exe/astro-server:latest`
and the same port, path and variables.

Working when: `http://<host>:8080/healthz` returns `ok`, and `http://<host>:8080/` shows the site.

To change the site, edit Markdown in `src/content/docs/` and push to `main`. A new image
is published a few minutes later; pull it on the host. Full setup is in
[docs/DEV-SETUP.md](docs/DEV-SETUP.md).

## Details

The full tables of variables, volumes and ports are in
[docs/QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md).

Serves on port 8080, plain HTTP. Put a reverse proxy (Nginx Proxy Manager, a Cloudflare
Tunnel) in front for TLS. Logs go to the container log and to `/config/logs/`. Extra
NGINX rules, such as redirects, go in `/config/nginx/*.conf`.

Known limitations: the site is static. Anything that needs a server at request time
(forms, a live store) needs a separate service.

- [Architecture](docs/ARCHITECTURE.md) — system design and the decisions behind it
- [Dev setup](docs/DEV-SETUP.md) — from a clone to a running copy
- [Quick reference](docs/QUICK-REFERENCE.md) — commands, ports and paths

## Attributions

Built on [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) for the
site, and [NGINX](https://nginx.org) for serving it. The Dockerfile and NGINX config start
from Astro's official [Docker recipe](https://docs.astro.build/en/recipes/docker/).

Licensed under [MIT](LICENSE).

---

**Repository**: https://github.com/AnotherMike-exe/AstroServer · **Maintainer**: Plum Solutions
