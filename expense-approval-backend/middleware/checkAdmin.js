// middleware/checkAdmin.js
const db = require("../services/database");  // Import your database connection

const checkAdmin = (req, res, next) => {
    const userId = req.user.id; // Assuming the user ID is stored in the token

    const query = 'SELECT role FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking user role', error: err });
        }
        if (result.length === 0 || result[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden: Admins only' });
        }
        next(); // Proceed to the next route handler if user is an admin
    });
};

module.exports = checkAdmin;
