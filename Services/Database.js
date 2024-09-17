// Desc: Database Service
// Database connection logic and User Schema
// Does: Connect to MongoDB, Create User Schema if not exist, Generate Admin User if not exist
// Returns: Database connection and User Schema
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const logger = require("./Logger.js");

// Connect to MongoDB
const dbName = "wildlifedb_main";
const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
    logger.info("Connected to MongoDB.");
    await createAdminUser();
  } catch (err) {
    logger.error(err);
  }
};

// Outline a New Collection called Users if not exist
const UserSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_password: { type: String, required: true },
  user_email: { type: String, required: true },
  user_phone: { type: String, required: true },
  user_address: { type: String, default: null },
  user_city: { type: String, default: null },
  user_state: { type: String, default: null },
  user_zip: { type: String, default: null },
  user_country: { type: String, required: true },
  user_role: { type: String, default: "user" },
  user_status: { type: Boolean, default: true },
  user_created: { type: Date, default: Date.now },
  user_updated: { type: Date, default: Date.now },
});
// Create the New Collection
const User = mongoose.model("Users", UserSchema);

// Generate a default admin user if not exist
const createAdminUser = async () => {
  logger.info("Database: Checking for admin user.");
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({
      user_name: "admin",
      user_role: "admin",
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const admin = new User({
        user_name: "admin",
        user_password: hashedPassword,
        user_email: "admin@example.com",
        user_phone: "1234567890",
        user_country: "MY",
        user_role: "admin",
      });
      // Save the admin user in the database
      await admin.save();
      logger.info("Database: Admin user created.");
    } else {
      logger.info("Database: Admin user already exists.");
    }
  } catch (err) {
    logger.error(err);
  }
};

module.exports = { connectToDatabase, User };
