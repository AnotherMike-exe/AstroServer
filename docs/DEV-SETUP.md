# Dev Setup — AstroServer

From a fresh clone to a running, tested copy. If a step here fails, the project is
wrong, not the reader.

Target: 5 minutes on a machine that already has Node and Docker.

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 24 (see `.nvmrc`); 22.12 minimum | `node --version` |
| npm | comes with Node | `npm --version` |
| Docker | 24 or newer, only to test the image | `docker --version` |
| git | any | `git --version` |

## 1. Clone

```bash
git clone https://github.com/AnotherMike-exe/AstroServer.git
cd AstroServer
git config pull.rebase true
```

`pull.rebase` keeps history linear, which the ruleset on `main` enforces anyway.

## 2. Install

```bash
npm ci
mkdir -p _resources/{Examples,Research,Assets,Notes}   # optional, gitignored
```

## 3. Configure

Nothing is needed to run locally. `SITE_URL` only matters for the published image; set
it as a repository variable in GitHub (see `docs/ARCHITECTURE.md`).

## 4. Run

```bash
npm run dev
```

Working when: http://localhost:4321 shows the home page and edits in
`src/content/docs/` reload in the browser.

The image, built locally:

```bash
docker build --build-arg SITE_URL=http://localhost:8080 -t astro-server:dev .
docker run --rm -p 8080:8080 -v "$PWD/app-config:/config" astro-server:dev
```

Working when: http://localhost:8080/healthz returns `ok`.

## 5. Test

```bash
npm run check     # types and content frontmatter
npm run build     # the build CI runs
```

CI runs the same commands, plus a smoke test of the built container in
`BuildImage.yml`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|

Add a row the first time somebody hits a problem. A troubleshooting table written in
advance guesses.

## Where the rest is

| Question | Document |
|---|---|
| How it is built and why | `docs/ARCHITECTURE.md` |
| How Claude should work here | `docs/CLAUDE.md` |
| Commands, ports and paths at a glance | `docs/QUICK-REFERENCE.md` |
| What it does, for a user | `README.md` |
