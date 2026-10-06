#!/bin/sh
# AstroServer entrypoint.
# Applies the Binhex conventions, then hands over to NGINX:
#   PUID/PGID  NGINX workers run as this user, and files in /config belong to it
#   UMASK      permissions for files the container creates (logs)
#   TZ         log timestamps (tzdata is in the image)
#   DEBUG      true raises the NGINX error log to info level
set -eu

PUID="${PUID:-99}"
PGID="${PGID:-100}"
UMASK="${UMASK:-002}"
DEBUG="${DEBUG:-false}"

umask "$UMASK"

# Find or create the group and user that match PGID and PUID.
if ! getent group "$PGID" >/dev/null 2>&1; then
    addgroup -g "$PGID" astro
fi
GROUP_NAME="$(getent group "$PGID" | cut -d: -f1)"

if ! getent passwd "$PUID" >/dev/null 2>&1; then
    adduser -D -H -u "$PUID" -G "$GROUP_NAME" -s /sbin/nologin astro
fi
USER_NAME="$(getent passwd "$PUID" | cut -d: -f1)"

if [ "$DEBUG" = "true" ]; then
    LOG_LEVEL="info"
else
    LOG_LEVEL="warn"
fi

# Runtime settings that NGINX includes at the top of nginx.conf.
cat > /etc/nginx/runtime.conf <<EOF
user ${USER_NAME} ${GROUP_NAME};
error_log /dev/stderr ${LOG_LEVEL};
error_log /config/logs/error.log ${LOG_LEVEL};
EOF

# /config layout. The example is refreshed on every start; real .conf files are
# never touched.
mkdir -p /config/logs /config/nginx
cp /opt/astroserver/CustomExample.conf /config/nginx/CustomExample.conf.example
chown "$PUID:$PGID" /config /config/logs /config/nginx /config/nginx/CustomExample.conf.example
touch /config/logs/access.log /config/logs/error.log
chown "$PUID:$PGID" /config/logs/access.log /config/logs/error.log

# NGINX temp paths must be writable by the worker user.
chown -R "$PUID:$PGID" /var/cache/nginx

echo "AstroServer: PUID=${PUID} (${USER_NAME}) PGID=${PGID} (${GROUP_NAME}) UMASK=${UMASK} TZ=${TZ:-UTC} DEBUG=${DEBUG}"

# Refuse to start on a broken custom config, with the reason in the log.
nginx -t -q

exec "$@"
