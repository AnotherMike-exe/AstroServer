---
title: Get started with Anilist Link
description: Run Anilist Link in Docker and link your AniList account.
sidebar:
  label: Get started
  order: 1
---

Anilist Link connects AniList to Plex, Jellyfin, Crunchyroll, Sonarr and Radarr. It runs as
one container with a web dashboard.

## 1. Create the container

Save this as `docker-compose.yml`, and change the paths to your own:

```yaml
services:
  AnilistLink:
    image: ghcr.io/anothermike-exe/anilist-link:latest
    container_name: AnilistLink
    restart: unless-stopped
    shm_size: "2g"
    volumes:
      - /mnt/user/appdata/AnilistLink:/config
      - /mnt/user/media/anime:/media/anime
    environment:
      - PUID=99
      - PGID=100
      - UMASK=002
      - TZ=America/Los_Angeles
    ports:
      - "9876:9876"
```

Then start it:

```bash
docker compose up -d
```

## 2. Run the setup wizard

Open `http://<host>:9876`. The setup wizard starts on the first visit. Add your media folders,
then link AniList and any of Plex, Jellyfin, Crunchyroll, Sonarr and Radarr. Each service is
optional.

It works when the dashboard shows your AniList account.

## Things to know

- **Mount the library at the same path as your media server.** Anilist Link moves the files
  that Plex or Jellyfin report. If the container sees a different path, renames fail.
- **Set `PUID` and `PGID` to the user that owns your media**, or renames fail with permission
  errors.
- **Crunchyroll needs shared memory.** Its client runs Chromium, so keep `shm_size: "2g"`. If
  you do not use Crunchyroll, you can lower it to `512m`.
- **When AniList is down**, a banner shows on the dashboard and syncs pause. Anilist Link checks
  each hour and continues by itself.

## Next

- [Source code and issues on GitHub](https://github.com/AnotherMike-exe/Anilist-Link)
