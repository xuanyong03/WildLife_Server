const express = require("express");
const path = require("path");
const router = express.Router();
const { model } = require("mongoose");

// Logger (Winston)
const logger = require(path.join(
  __dirname,
  "..",
  "..",
  "Services",
  "Logger.js"
));

//Authentication imports
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");

const { User } = require(path.join(
  __dirname,
  "..",
  "..",
  "Services",
  "Database.js"
));

// Passport LocalStrategy for Login
passport.use(
  new LocalStrategy(
    // By default, LocalStrategy expects 'username' and 'password'
    // Changed to 'user_name' and 'user_password' as per our schema
    { usernameField: "user_name", passwordField: "user_password" },
    async (user_name, user_password, done) => {
      try {
        // Find the user in the database
        const userExist = await User.findOne({ user_name: user_name });
        if (!userExist) {
          // Note: done is a callback that has 3 parameters: (err, user, info.message)
          return done(null, false, { message: "User does not exist" });
        }

        // Check if hashed password is correct
        const validPassword = await bcrypt.compare(
          user_password,
          userExist.user_password
        );
        if (!validPassword) {
          return done(null, false, { message: "Incorrect password" });
        }

        // If everything is good, return the user object
        return done(null, userExist);
      } catch (err) {
        logging.error(err);
        return done(err);
      }
    }
  )
);

// Serialize user (store user info in session)
passport.serializeUser((user, done) => {
  // The user ID is saved to the session (only the ID, not the whole user object)
  // Note: ID is from _id in MongoDB
  done(null, user.id);
});

// Deserialize user (retrieve user info from session)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    logger.error(err);
    done(err);
  }
});

//API Endpoints with Passport
// Login API
router.post("/v1/login", (req, res, next) => {
  //Note: "local" is the name of the strategy we defined above
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    if (!user) {
      // Authentication failed, user or password invalid (see info.message's output)
      return res.json({ login: false, message: info.message });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        logging.error(err);
        return res.status(500).json({ message: "Login failed" });
      }
      return res.json({
        login: true,
        user_name: user.user_name,
        message: "Login successful",
      });
    });
  })(req, res, next);
});

module.exports = router;
