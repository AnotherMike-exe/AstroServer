# CLAUDE.md — AstroServer

Project memory for Claude Code. Keep it true: a line that is wrong is worse than a line
that is missing, because it is trusted.

## What this is

The Plum Solutions public website — home page, projects showcase and project
documentation — built as a static Astro + Starlight site and shipped as an NGINX image
on GHCR. The maintainer edits Markdown, pushes to `main`, and Unraid pulls the new tag.
A store comes later and will be a separate service.

**Stage**: prototype
**Deployed on**: Unraid (PlumServer), from `ghcr.io/anothermike-exe/astro-server`

## Stack

| Part | Choice |
|---|---|
| Language | TypeScript / Markdown / MDX |
| Framework | Astro 7, Starlight |
| Data store | None. Content is Markdown in git |
| Runtime | Docker, `nginx:1.30-alpine`, linux/amd64 and linux/arm64 |

## Layout

```
src/content/docs/   site content: index.mdx, projects/, docs/
astro.config.mjs    site title, sidebar, SITE_URL
nginx/              nginx.conf and the /config example include
scripts/            Entrypoint.sh (PUID/PGID/UMASK/TZ/DEBUG)
docs/               every document except README.md
_resources/         dev references, never in git
```

## Commands

```bash
npm ci                 # install
npm run dev            # run locally, http://localhost:4321
npm run check          # astro check
npm run build          # static build into dist/
docker compose up -d   # run the container
```

## Conventions

**Naming**: Astro dictates `src/` and `src/content/docs/` and lowercase URL slugs, so
content files and folders are lowercase-kebab (`projects/anilist-link.md`); the
ecosystem wins there. Other directories, documentation filenames and the container name
are PascalCase. Variables are camelCase. Constants are `UPPER_SNAKE_CASE`.

**Errors**: the entrypoint uses `set -eu` and runs `nginx -t` before starting, so a bad
config stops the container with the reason in the log rather than serving half a site.

**Project-specific rules**:
- Keep the Dockerfile and `nginx/nginx.conf` close to Astro's official Docker recipe.
  Changes are fine; say why in a comment.
- Nothing dynamic in the image. A feature that needs a server is a separate service.

## Claude Code Conventions

**Plan mode is encouraged.** Anything beyond a trivial edit gets a plan and approval
first — multi-file changes, refactors, anything touching Docker or CI.

**Subagents are encouraged** for parallelizable work: research spikes, reading large
references, multi-file audits. The main thread integrates.

Standing rules for this repo: rebase, never merge. `_resources/` never enters git. CI
green before merge. The rules themselves live in the `plum-standards` skill.

## The phase loop

Each phase of the build runs the same five steps.

1. `/resume-session` — restore the state the last phase left
2. Build. Name `tdd-workflow` only for a bug fix, where the test is the reproducer
3. `verification-loop` — the gate at the end of the phase
4. Review in parallel: `code-reviewer`, `security-reviewer` and `typescript-reviewer`
5. `/learn-eval`, then `/save-session`

Commit at the end of every phase. A local commit costs nothing and gives the review a
diff to read.

`blueprint` holds the phase plan between sessions. Each step in it carries a brief that a
fresh session can execute cold.

## Docker

Volumes, environment variables and ports are in `docs/QUICK-REFERENCE.md`.

What is true of this project and not of every Binhex container:

- No supervisord. NGINX is the only process; logs are in `/config/logs/` and the
  container log. The reason is in `docs/ARCHITECTURE.md`.
- Only `/config` is a volume. The site is inside the image, not on a volume.
- `SITE_URL` is a build argument, not a runtime variable.

First place to look when the container misbehaves: `docker logs AstroServer`, then
`/config/logs/error.log`.

## Gotchas

- The Docker build cannot be tested in a sandbox without Docker Hub access → the
  `BuildImage.yml` smoke test is the real check.

## Where the rules live

The Plum Solutions standards are in the `plum-standards` skill, not copied here. This
file holds only what is true of **this** project.
