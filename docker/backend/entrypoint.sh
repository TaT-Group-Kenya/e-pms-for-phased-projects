#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Try using mysql command first, fall back to PHP check
    if command -v mysql >/dev/null 2>&1; then
        if mysql --disable-ssl -h "${DB_HOST:-db}" -P "${DB_PORT:-3306}" -u "${DB_USERNAME:-laravel_user}" -p"${DB_PASSWORD:-secret}" "${DB_DATABASE:-epms_db}" -e "SELECT 1" 2>/dev/null; then
            echo "MySQL is ready!"
            break
        fi
    else
        # Use PHP to check MySQL connection with SSL disabled
        if php -r "\$m = mysqli_init(); mysqli_ssl_disable(\$m); if (mysqli_real_connect(\$m, '${DB_HOST:-db}', '${DB_USERNAME:-laravel_user}', '${DB_PASSWORD:-secret}', '${DB_DATABASE:-epms_db}', ${DB_PORT:-3306})) { echo 'Connected'; }" >/dev/null 2>&1; then
            echo "MySQL is ready!"
            break
        fi
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Attempt $RETRY_COUNT/$MAX_RETRIES - MySQL not ready, waiting 2 seconds..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "ERROR: MySQL is not available after $MAX_RETRIES attempts"
    exit 1
fi

# Copy .env file if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Clear configuration cache to ensure environment variables are used
echo "Clearing configuration cache..."
php artisan config:clear

# Set application key if not set
if [ -z "$(php -r 'echo config(\"app.key\");' 2>/dev/null)" ]; then
    php artisan key:generate
fi

# Run Laravel migrations
echo "Running database migrations..."
php artisan migrate --force

# Run Laravel seeders
echo "Running database seeders..."
php artisan db:seed --force

echo "Running storage link..."
php artisan storage:link

# Optimize Laravel
echo "Optimizing Laravel application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions for mounted volumes
# Host files are owned by juma:staff (uid 501, gid 20 on macOS)
# PHP-FPM runs as www-data in container with different uid/gid
# Solution: Use world-writable permissions for development
echo "Fixing permissions for mounted volumes..."
chmod -R 777 /var/www/html/storage
chmod -R 777 /var/www/html/bootstrap/cache

# Extract host from APP_URL for nginx server_name
echo "Configuring nginx with APP_URL..."
# Read APP_URL from .env file directly
APP_URL_VALUE=""
if [ -f /var/www/html/.env ]; then
    APP_URL_VALUE=$(grep "^APP_URL=" /var/www/html/.env 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'")
fi

# Extract host from URL: http://example.com/path -> example.com
if [ -n "$APP_URL_VALUE" ]; then
    APP_URL_HOST=$(echo "$APP_URL_VALUE" | sed 's|http[s]*://||' | sed 's|/.*||' | sed 's|:.*||')
else
    # Fallback to localhost if APP_URL not found
    APP_URL_HOST="localhost"
fi
export APP_URL_HOST

# Generate nginx config with environment variables
if [ -f /etc/nginx/http.d/laravel.conf.template ]; then
    # Ensure APP_URL_HOST has a default value
    export APP_URL_HOST="${APP_URL_HOST:-localhost}"
    # Generate config from template
    envsubst '${APP_URL_HOST}' < /etc/nginx/http.d/laravel.conf.template > /etc/nginx/http.d/laravel.conf
fi

# Start nginx and PHP-FPM
echo "Starting nginx and PHP-FPM..."
nginx -c /etc/nginx/nginx.conf || true
exec php-fpm -F
