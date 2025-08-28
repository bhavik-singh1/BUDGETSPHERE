const express = require("express");
const router = express.Router();
const db = require("../services/database");  // Import your database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const passwordSchema = Joi.string()
//     .min(6)
//     .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
//     .required();
// const emailSchema = Joi.string().email().required();

 const jwtSecret = 'supersecretkey123456790!@#';


 router.post("/login", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const query = "SELECT * FROM users WHERE username = ? AND email = ?";
    db.query(query, [username, email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking user", error: err });
        }

        if (result.length !== 1) {
            return res.status(400).json({ message: "Invalid username, email, or password" });
        }

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username, email, or password" });
        }

        // Create access token (short expiry)
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email, post: user.post },
            jwtSecret,
            { expiresIn: "1h" } // 1 hour expiration
        );

        // Create refresh token (longer expiry)
        const refreshToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email, post: user.post },
            jwtSecret,
            { expiresIn: "7d" } // 7 days expiration
        );

        // Optionally, store refresh token in the database if needed
        // db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, email: user.email, post: user.post },
        });
    });
});

module.exports = router;