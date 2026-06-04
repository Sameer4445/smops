# ════════════════════════════════════════════════════════════════
# Student Management System – Frontend Dockerfile
# Multi-stage: build React app with Vite, serve via Nginx
# ════════════════════════════════════════════════════════════════

# ── Stage 1: Build ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies separately from source
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source and build
COPY . .

# VITE_API_URL must point to the backend (set at build time or via --build-arg)
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build


# ── Stage 2: Serve with Nginx ───────────────────────────────────
FROM nginx:1.25-alpine AS runner

# Remove default Nginx site
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5173/health.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
