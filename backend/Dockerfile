# ════════════════════════════════════════════════════════════════
# Student Management System – Backend Dockerfile
# Multi-stage build for a minimal, production-ready Node.js image
# sqlite3 requires native compilation (python3 + make + g++)
# ════════════════════════════════════════════════════════════════

# ── Stage 1: Build (with native compilation tools) ────────────
FROM node:20-alpine AS builder

# Install native build tools required by sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .


# ── Stage 2: Production runner ─────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid  1001 express

WORKDIR /app

# Copy compiled node_modules (with native bindings) from builder
COPY --from=builder --chown=express:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=express:nodejs . .

# Create runtime-writable directories
RUN mkdir -p database/data logs \
  && chown -R express:nodejs database logs

USER express

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

CMD ["node", "server.js"]
