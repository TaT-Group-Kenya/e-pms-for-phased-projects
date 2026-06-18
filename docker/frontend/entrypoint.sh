#!/bin/sh

# Extract host from APP_URL for nginx server_name
echo "Configuring nginx with environment variables..."

# Read APP_URL from .env.local or .env.production file directly
APP_URL_VALUE=""
if [ -f /app/.env.local ]; then
    APP_URL_VALUE=$(grep "^NEXT_PUBLIC_EPMS_API_BASE=" /app/.env.local 2>/dev/null | grep -v "^#" | cut -d'=' -f2- | tr -d '"' | tr -d "'" | head -1)
fi

# If not found in .env.local, try .env.production
if [ -z "$APP_URL_VALUE" ] && [ -f /app/.env.production ]; then
    APP_URL_VALUE=$(grep "^NEXT_PUBLIC_EPMS_API_BASE=" /app/.env.production 2>/dev/null | grep -v "^#" | cut -d'=' -f2- | tr -d '"' | tr -d "'" | head -1)
fi

# Extract host from URL: http://example.com/path -> example.com
if [ -n "$APP_URL_VALUE" ]; then
    # Extract host from URL: http://example.com/path -> example.com
    APP_URL_HOST=$(echo "$APP_URL_VALUE" | sed 's|http[s]*://||' | sed 's|/.*||' | sed 's|:.*||')
else
    # Fallback to localhost if APP_URL not found
    APP_URL_HOST="localhost"
fi

# Export for nginx config generation
export APP_URL_HOST

# Generate nginx config from template
if [ -f /etc/nginx/http.d/default.conf.template ]; then
    envsubst '${APP_URL_HOST}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf
fi

# Start Next.js on port 3000
cd /app && npm run start &

# Start nginx in foreground
exec nginx -g "daemon off;"
