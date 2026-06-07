# ─────────────────────────────────────────────
#  MEGARAM CASA – Microservice Films
#  Node.js · Port 3001 · RabbitMQ Producer
#  Entry point: src/app.js
# ─────────────────────────────────────────────

# Stage 1 – Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ─────────────────────────────────────────────

# Stage 2 – Runtime image
FROM node:20-alpine AS runtime

# Metadata labels
LABEL maintainer="MEGARAM CASA"
LABEL service="microservice-films"
LABEL version="1.0.0"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files (src/ directory)
COPY src/ ./src/

# Copy .env file if present (will be overridden by docker-compose env_file / environment)
COPY .env* ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the films service port
EXPOSE 3001

# Healthcheck: verify the service responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -fs http://localhost:3001/health || exit 1

# Start the films microservice
CMD ["node", "src/app.js"]
