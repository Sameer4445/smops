/**
 * Student Management System - Express Server
 * Single-container deployment: serves React frontend + REST API
 *
 * Route priority:
 *   1. /health          → health check JSON
 *   2. /api/students/*  → REST API
 *   3. /public static   → React build assets (JS, CSS, images)
 *   4. *                → index.html (React Router SPA fallback)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const { initDatabase } = require("./database/init");
const studentRoutes = require("./routes/studentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { requestLogger } = require("./middleware/requestLogger");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Path to the React production build copied into the backend image
const FRONTEND_DIST = path.join(__dirname, "public");
const INDEX_HTML    = path.join(FRONTEND_DIST, "index.html");
const hasFrontend   = fs.existsSync(INDEX_HTML);

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    // In single-container mode the frontend is on the same origin,
    // so CORS_ORIGIN can stay empty or match the App Service URL.
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(requestLogger);

// ─── API & Health Routes (registered BEFORE static files) ────────────────────

// Health check – must be reachable even if no frontend build exists
app.use("/", healthRoutes);

// REST API
app.use("/api/students", studentRoutes);

// ─── Serve React Frontend (production only) ───────────────────────────────────

if (hasFrontend) {
  logger.info(`📦 Serving React frontend from ${FRONTEND_DIST}`);

  // Serve hashed static assets with aggressive caching
  app.use(
    express.static(FRONTEND_DIST, {
      maxAge: "1y",           // cache JS/CSS/images for 1 year (Vite adds content hash)
      etag: true,
      index: false,           // don't auto-serve index.html here; SPA fallback handles it
    })
  );

  // SPA fallback – any non-API, non-asset route returns index.html
  // This enables React Router to handle client-side navigation
  app.get("*", (_req, res) => {
    res.sendFile(INDEX_HTML);
  });
} else {
  // Development / backend-only mode – return 404 for unknown routes
  logger.warn("⚠️  No frontend build found at ./public – running in API-only mode");

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });
}

// ─── Global Error Handler (must be last) ─────────────────────────────────────

app.use(errorHandler);

// ─── Database Init & Server Start ────────────────────────────────────────────

const startServer = async () => {
  try {
    await initDatabase();
    logger.info("✅ Database initialized successfully");

    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`📡 Health:    http://localhost:${PORT}/health`);
      logger.info(`📚 API:       http://localhost:${PORT}/api/students`);
      if (hasFrontend) {
        logger.info(`🌐 Frontend:  http://localhost:${PORT}/`);
      }
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
