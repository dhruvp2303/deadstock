FROM php:8.2-cli-alpine

RUN apk add --no-cache \
    sqlite-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_sqlite pcntl bcmath

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application code
COPY . /app

# Install composer dependencies without dev packages
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Prepare storage & sqlite
RUN mkdir -p /app/storage/framework/sessions \
    && mkdir -p /app/storage/framework/views \
    && mkdir -p /app/storage/framework/cache \
    && mkdir -p /app/storage/logs \
    && mkdir -p /app/database \
    && touch /app/database/database.sqlite \
    && chmod -R 777 /app/storage /app/bootstrap/cache /app/database

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV PORT=8000
EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
