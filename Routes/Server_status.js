const express = require("express");
const router = express.Router();

// Server testing
router.get("/test", async (req, res) => {
  try {
    res.status(200).send("<h1>Success, server working.</h1>");
  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
});

// Redirect to /test
router.get("/", async (req, res) => {
  try {
    res.redirect("/test");
  } catch (err) {
    res.status(400).send;
  }
});

module.exports = router;
