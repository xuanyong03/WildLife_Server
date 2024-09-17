const express = require("express");
const router = express.Router();
const path = require("path");
const logger = require(path.join(__dirname, "..", "Services", "Logger.js"));
const statusMonitor = require("express-status-monitor");

const app = express();

// Add status monitor middleware
router.use(statusMonitor());

// Server testing
router.get("/test", async (req, res) => {
  try {
    res.status(200).send("<h1>success, server working.</h1>");
  } catch (err) {
    res.status(400).send(err);
    logger.error(err);
  }
});

// Redirect to /test
router.get("/", async (req, res) => {
  try {
    res.redirect("/status");
  } catch (err) {
    res.status(400).send;
    logger.error(err);
  }
});

module.exports = router;
