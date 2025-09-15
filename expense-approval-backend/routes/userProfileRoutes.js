const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../services/database");  // Import your database connection
const authenticateToken = require('../middleware/authenticateToken'); // Import the JWT authentication middleware

// View User Profile (GET)
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const query = `SELECT id, username, email FROM users WHERE id = ?`;

    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching profile', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result[0]); // Return the user's profile (without the password)
    });
});


// View User Profile (GET)
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id; // Extract user ID from the token

    const query = `SELECT id, username, email FROM users WHERE id = ?`;

    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching profile', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result[0]); // Return the user's profile (without the password)
    });
});

// Update User Profile (PUT)
router.put('/profile', authenticateToken, (req, res) => {
    const { username, email, password } = req.body;

    let updateFields = [];
    let queryValues = [];

    if (username) {
        updateFields.push('username = ?');
        queryValues.push(username);
    }

    if (email) {
        updateFields.push('email = ?');
        queryValues.push(email);
    }

    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        updateFields.push('password = ?');
        queryValues.push(hashedPassword);
    }

    queryValues.push(req.user.id); // Add the user ID at the end for the WHERE condition
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, queryValues, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating profile', error: err });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
});


module.exports = router;
