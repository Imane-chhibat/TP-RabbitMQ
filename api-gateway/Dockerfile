# ─────────────────────────────────────────────
#  MEGARAM CASA – API Gateway
#  Node.js · Port 3000 · Entry point: app.js
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
LABEL service="api-gateway"
LABEL version="1.0.0"

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY app.js ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the gateway port
EXPOSE 3000

# Healthcheck: verify the gateway responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the gateway
CMD ["node", "app.js"]
