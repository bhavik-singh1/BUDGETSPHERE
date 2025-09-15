const express = require("express");
const router = express.Router();
const db = require("../services/database"); // Ensure the correct path to your database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const cors = require("cors");

// Enable CORS for all routes in this router

router.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

router.use(cors());

const jwtSecret = "supersecretkey123456790!@#";

// Joi validation schemas
const passwordSchema = Joi.string()
  .min(6)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .required();

const emailSchema = Joi.string().email().required();

// 🚀 **Registration Route**
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    //1️⃣ **Check if all fields are provided**
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, password, and email are required" });
    }

    // ✅ 2️⃣ **Validate email format**
    const emailValidation = emailSchema.validate(email);
    if (emailValidation.error) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ 3️⃣ **Validate password complexity**
    const passwordValidation = passwordSchema.validate(password);
    if (passwordValidation.error) {
      return res.status(400).json({ message: "Password does not meet complexity requirements" });
    }

    // ✅ 4️⃣ **Check if username or email already exists**
    const [existingUser] = await db.promise().query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // ✅ 5️⃣ **Hash the password before storing**
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 6️⃣ **Insert new user into the database**
    const [result] = await db.promise().query(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );

    // ✅ 7️⃣ **Generate JWT token**
    const token = jwt.sign(
      { id: result.insertId, username, email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // ✅ 8️⃣ **Send success response**
    return res.status(201).json({
      message: "User registered successfully",
      token,
    });

  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({
      message: "An error occurred during registration",
      error: err.message,
    });
  }
});

module.exports = router;
