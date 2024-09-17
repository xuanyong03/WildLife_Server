const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// HTTPS
const https = require("https");
const http = require("http"); // For redirecting HTTP to HTTPS

// Import Passport
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");

// Import Database Connection
const { connectToDatabase } = require(path.join(
  __dirname,
  "Services",
  "Database.js"
));

// Logger (Winston)
const logger = require(path.join(__dirname, "Services", "Logger.js"));

// Load environment variables
dotenv.config();
if (!process.env.PORT) {
  logger.error("Environment variables not found. Check .env file.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to log each request and client IP
app.use((req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.info(
    `Client IP: ${clientIp} - ${req.method} to ${req.originalUrl}` +
      (req.body ? ` with ${JSON.stringify(req.body)}` : "")
  );
  next();
});

// Middleware for Passport (express-session)
app.use(
  session({
    // Note: To regenerate secret for deployment
    secret:
      process.env.SESSION_SECRET ||
      "z8pc6zZ2MyBa0Z9teeLB0PReV4ia0josR2iLB244xtthOQHhoB",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Create HTTPS Server
// Note: CSR key is used to request SSL certificate from CA
// Note: Private key is generated from CSR key
// Change private.key and certificate.crt from legitimate CA in production
const privateKey = fs.readFileSync(
  path.join(__dirname, "Certs", "private.key")
);
const certificate = fs.readFileSync(
  path.join(__dirname, "Certs", "certificate.crt")
);
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// Create HTTP Server and redirect all traffic to HTTPS
// Demonstrate redirecting HTTP to HTTPS (assume port 8080 is HTTP)
const httpApp = express();
httpApp.use((req, res, next) => {
  if (!req.secure) {
    const host = req.headers.host.split(":")[0]; // Extract the hostname without the port
    return res.redirect(`https://${host}:${port}${req.url}`);
  }
  next();
});
const httpPort = 8080;
const httpServer = http.createServer(httpApp);
httpServer.listen(httpPort, () => {
  logger.info(
    `HTTP Server is running on port ${httpPort} and redirecting to HTTPS`
  );
});

// HTTPS: Listen to port
httpsServer.listen(port, () => {
  logger.info(`HTTPS Server is running on port ${port}`);
}); // Use 10.0.2.2:PORT for Localhost on Android Emulator
