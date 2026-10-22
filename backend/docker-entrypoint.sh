#!/bin/sh
set -e

# Ensure SQLite file exists
if [ ! -f /app/database/database.sqlite ]; then
    touch /app/database/database.sqlite
    chmod 666 /app/database/database.sqlite
fi

# Ensure application key exists if not provided
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

echo "Starting DeadStock Laravel API server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
