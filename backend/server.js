/**
 * Student Management System - Express Server
 * Entry point for the backend API
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { initDatabase } = require("./database/init");
const studentRoutes = require("./routes/studentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { requestLogger } = require("./middleware/requestLogger");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS configuration - allow frontend origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logging via morgan (dev format in development)
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// Custom request logger middleware
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/students", studentRoutes);
app.use("/", healthRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ─── Database Init & Server Start ─────────────────────────────────────────────

const startServer = async () => {
  try {
    // Initialize SQLite database and seed demo data if empty
    await initDatabase();
    logger.info("✅ Database initialized successfully");

    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`📡 Health check: http://localhost:${PORT}/health`);
      logger.info(`📚 API base:     http://localhost:${PORT}/api/students`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
