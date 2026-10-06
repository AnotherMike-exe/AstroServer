# AstroServer — Plum Solutions website image.
#
# Based on Astro's official Docker recipe (static output, served by NGINX):
#   https://docs.astro.build/en/recipes/docker/
# Adapted to the Plum Binhex conventions: PUID/PGID/UMASK/TZ, logs under /config.

# ---- Build stage: Astro builds the static site into /app/dist ----
# The output is plain HTML/CSS/JS, the same on every architecture, so this stage runs
# on the build machine's own platform. The arm64 image then skips building under
# emulation, which is the slow part of a multi-arch build.
FROM --platform=$BUILDPLATFORM node:24-alpine AS build

WORKDIR /app

# Dependencies first, so a content change does not invalidate this layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Public address of the site, used for the sitemap and canonical links.
ARG SITE_URL=""
ENV SITE_URL=${SITE_URL}
RUN npm run build

# ---- Runtime stage: NGINX serves the static files ----
FROM nginx:1.30-alpine

LABEL org.opencontainers.image.source="https://github.com/AnotherMike-exe/AstroServer" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.description="Plum Solutions website: Astro and Starlight, served by NGINX."

# tzdata makes TZ resolve to a real zone, so log timestamps use local time.
RUN apk add --no-cache tzdata

# Binhex standard environment variables with defaults.
ENV PUID=99 \
    PGID=100 \
    UMASK=002 \
    TZ=UTC \
    DEBUG=false

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/CustomExample.conf /opt/astroserver/CustomExample.conf
COPY scripts/Entrypoint.sh /opt/astroserver/Entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /opt/astroserver/Entrypoint.sh && \
    rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /config

VOLUME ["/config"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["/opt/astroserver/Entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
