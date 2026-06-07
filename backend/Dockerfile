# ════════════════════════════════════════════════════════════════
# Student Management System – Single-Container Dockerfile
#
# Stage 1 (frontend-builder) : builds React app with Vite
# Stage 2 (backend-builder)  : installs Node deps (compiles sqlite3)
# Stage 3 (runner)           : minimal production image
#
# Final container exposes port 3000 and serves:
#   /          → React SPA (from backend/public/)
#   /api/*     → Express REST API
#   /health    → Health check endpoint
# ════════════════════════════════════════════════════════════════

# ── Stage 1: Build React frontend ─────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Cache dependency layer separately
COPY frontend/package*.json ./
RUN npm ci && npm cache clean --force

# Copy frontend source and build
COPY frontend/ .

# API calls go to the same origin – no absolute URL needed
ENV VITE_API_URL=""

RUN npm run build
# Output: /frontend/dist


# ── Stage 2: Install backend dependencies ─────────────────────
FROM node:20-alpine AS backend-builder

# sqlite3 requires native compilation tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci && npm cache clean --force


# ── Stage 3: Production runner ─────────────────────────────────
FROM node:20-alpine AS runner

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid  1001 express

WORKDIR /app

# Copy compiled backend node_modules
COPY --from=backend-builder --chown=express:nodejs /app/node_modules ./node_modules

# Copy backend source
COPY --chown=express:nodejs backend/ .

# Copy React build into backend/public so Express can serve it
COPY --from=frontend-builder --chown=express:nodejs /frontend/dist ./public

# Create writable runtime directories
RUN mkdir -p database/data logs \
  && chown -R express:nodejs database logs

USER express

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

CMD ["node", "server.js"]
