const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const path = require("path");

const { connectToDatabase } = require(path.join(
  __dirname,
  "Services",
  "Database.js"
));

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to log each request
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}` +
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
  console.log(`Server is running on port ${port}`);
}); // Use 10.0.2.2 for Localhost on Android Emulator
