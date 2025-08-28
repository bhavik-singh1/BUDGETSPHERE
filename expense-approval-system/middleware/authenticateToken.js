// authenticateToken.js

const jwt = require('jsonwebtoken');

const jwtSecret = 'supersecretkey123456790!@#'; // Your secret key

function authenticateToken(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            // If the token is invalid or expired, return a 403 Forbidden response
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        
        // Attach the user information to the request object
        req.user = user;
        
        // Pass control to the next middleware function or route handler
        next();
    });
}

module.exports = authenticateToken; // Export the function to use it in other parts of your app
