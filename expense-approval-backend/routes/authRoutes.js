const express = require("express");
const db = require("../services/database");  // Import your database connection
const emailservice = require("../services/emailservice"); // Import your email service
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');


const passwordSchema = Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required();
const emailSchema = Joi.string().email().required();





// API endpoint to request OTP (Forgot Password)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if the email exists in the database
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ message: "Database error. Please try again later." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Email not found in our database" });
            }

            // Generate OTP
            const otp = emailservice.generateOTP();

            try {
                // Send OTP email to the user
                await emailservice.sendOTPEmail(email, otp);

                // Store OTP temporarily
                emailservice.storeOTP(email, otp);

                res.status(200).json({ message: "OTP sent to email" });
            } catch (emailError) {
                console.error("Error during OTP email sending:", emailError);
                return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
            }
        });
    } catch (error) {
        console.error("Unexpected error during OTP generation or sending:", error);
        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
});


// ✅ API endpoint to verify OTP
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    console.log(`Received OTP: ${otp} for email: ${email}`);

    try {
        const storedOTP = emailservice.getStoredOTP(email);
        if (!storedOTP) {
            return res.status(400).json({ message: "No OTP found for this email address" });
        }

        console.log(`Stored OTP for ${email}: ${storedOTP}`);

        if (emailservice.isOTPExpired(email)) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "An error occurred during OTP verification." });
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    // Validate email format
    const emailValidation = emailSchema.validate(email);
    if (emailValidation.error) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password complexity
    const passwordValidation = passwordSchema.validate(newPassword);
    if (passwordValidation.error) {
        return res.status(400).json({ message: 'Password does not meet complexity requirements' });
    }

    try {
        // Step 1: Verify OTP
        const storedOTP = emailservice.getStoredOTP(email);
        if (!storedOTP) {
            return res.status(400).json({ message: 'No OTP found for this email address' });
        }

        if (emailservice.isOTPExpired(email)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Step 2: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 3: Update the password in the database
        db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], async (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).json({ message: 'Error updating password. Please try again later.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Step 4: Send password reset confirmation email
            try {
                await emailservice.sendPasswordResetConfirmationEmail(email);
                return res.status(200).json({ message: 'Password reset successfully. A confirmation email has been sent.' });
            } catch (emailError) {
                console.error('Error sending confirmation email:', emailError);
                return res.status(500).json({ message: 'Password reset successful, but confirmation email failed to send.' });
            }
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;