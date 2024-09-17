const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const path = require("path");

// Import Database Connection
const { connectToDatabase } = require(path.join(
  __dirname,
  "Services",
  "Database.js"
));

// Logger (Winston)
const logger = require(path.join(__dirname, "Services", "Logger.js"));

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to log each request and client IP
app.use((req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.info(
    `Client IP: ${clientIp} - ${req.method} ${req.originalUrl}` +
      (req.body ? ` - ${JSON.stringify(req.body)}` : "")
  );
  next();
});

// Connect to MongoDB
connectToDatabase();

/* Routes */
// Test Server Status
const serverStatusRoutes = require(path.join(
  __dirname,
  "Routes",
  "Server_status.js"
));
app.use("/", serverStatusRoutes);
// API
// Authentication (Login, Register, Check User Status)
const authAPIRoutes = require(path.join(
  __dirname,
  "Routes",
  "API",
  "Authentication.js"
));
app.use("/api", authAPIRoutes); // e.g. /api/v1/login

// Listen to port
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); // Use 10.0.2.2 for Localhost on Android Emulator
