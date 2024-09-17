const bcrypt = require("bcrypt");
const express = require("express");
const path = require("path");
const router = express.Router();
const { model } = require("mongoose");

const { User } = require(path.join(
  __dirname,
  "..",
  "..",
  "Services",
  "Database.js"
));

// API Endpoints (maybe make a helper.js file)
// Check user exist API and if user is active/inactive/does not exist
router.post(`/v1/user_status`, async (req, res) => {
  try {
    // Receive user_name from request body
    const { user_name } = req.body;
    // Check if user exists
    const userExist = await User.findOne({ user_name: user_name });
    if (userExist) {
      if (userExist.user_status) {
        res.json({ exists: true, active: true, message: "User is active" });
      } else {
        res.json({ exists: true, active: false, message: "User is inactive" });
      }
    } else {
      res.json({
        exists: false,
        active: false,
        message: "User does not exist",
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.error(err);
  }
});

// Login API
router.post(`/v1/login`, async (req, res) => {
  try {
    // Receive user_name and user_password from request body
    const { user_name, user_password } = req.body;
    // Check if user exists
    const userExist = await User.findOne({ user_name: user_name });
    if (userExist) {
      // Check if password is correct
      const validPassword = await bcrypt.compare(
        user_password,
        userExist.user_password
      );
      if (validPassword) {
        res.json({
          exists: true,
          login: true,
          user_name: userExist.user_name,
          message: "Login successful",
        });
      } else {
        res.json({ exists: true, login: false, message: "Incorrect password" });
      }
    } else {
      res.json({ exists: false, login: false, message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).send(err);
    console.error(err);
  }
});

// Registration API
router.post("/v1/new_user");

module.exports = router;
