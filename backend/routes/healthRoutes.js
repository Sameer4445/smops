/**
 * Health Check Routes
 * Used by Azure DevOps deployment verification and load balancers
 */

const express = require("express");
const router = express.Router();

// GET /health
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    application: "Student Management System",
    environment: process.env.NODE_ENV || "production",
    version: process.env.APP_VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// GET / – root redirect info
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Student Management System API",
    version: "1.0.0",
    docs: "/api/students",
    health: "/health",
  });
});

module.exports = router;
