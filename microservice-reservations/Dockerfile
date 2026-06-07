# ─────────────────────────────────────────────
#  MEGARAM CASA – Microservice Réservations
#  PHP 8.1 + Composer · Port 3003
#  Slim Framework · Entry point: public/
# ─────────────────────────────────────────────

FROM php:8.1-cli-alpine

# Metadata labels
LABEL maintainer="MEGARAM CASA"
LABEL service="microservice-reservations"
LABEL version="1.0.0"

# Install system dependencies
RUN apk add --no-cache \
    curl \
    unzip \
    git \
    libzip-dev \
    && docker-php-ext-install zip

# Install Composer globally
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy composer manifests first to leverage Docker layer caching
COPY composer.json composer.lock* ./

# Install PHP dependencies (production mode, no dev dependencies)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist \
    2>/dev/null || echo "No Composer dependencies defined – skipping"

# Copy application source files
COPY src/ ./src/
COPY public/ ./public/

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the reservations service port
EXPOSE 3003

# Healthcheck: verify the PHP built-in server responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -fs http://localhost:3003/ || exit 1

# Launch PHP built-in server serving the public/ directory
CMD ["php", "-S", "0.0.0.0:3003", "-t", "public/"]
