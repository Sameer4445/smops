/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns structured JSON responses
 */

const logger = require("./logger");

const errorHandler = (err, req, res, _next) => {
  // Log the full error stack in development
  logger.error(`❌ Error on ${req.method} ${req.originalUrl}: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    logger.error(err.stack);
  }

  // SQLite constraint errors (unique violation, etc.)
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
      error: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }

  // Syntax error in JSON body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // Default 500 response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

module.exports = { errorHandler };
