const nodemailer = require('nodemailer');

// Generate a random OTP (One-Time Password)
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    return otp.toString(); // Always return OTP as a string for consistent comparison
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  
        auth: {
            user: 'demonultimate9@gmail.com',
            pass: 'xexm vjid rina cxrf' // Use app password if using Gmail
        }
    });

    const mailOptions = {
        from: 'demonultimate9@gmail.com', // Sender address
        to: email,                    // Receiver address
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}`,  // Plain text body
        html: `<b>Your OTP is: ${otp}</b>` // Optional HTML body
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`Failed to send email to ${email}:`, error);
                reject(error); // Reject promise with error
            } else {
                console.log(`Email sent to ${email}:`, info.response);
                resolve(info.response); // Resolve promise with response
            }
        });
    });
};

// Example in-memory storage for OTP
let otpStore = {};

// Store OTP for a specific email
function storeOTP(email, otp) {
    otpStore[email] = {
        otp: otp,                 // Store the OTP
        timestamp: Date.now()     // Store the timestamp when OTP is created
    };
    console.log(`Stored OTP for ${email}:`, otpStore[email]); // Log stored OTP for debugging
}

// Get stored OTP for an email
function getStoredOTP(email) {
    if (!otpStore[email]) {
        console.error(`No OTP found for email: ${email}`); // Log if no OTP exists
        return null; // Return null if OTP not found
    }
    return otpStore[email].otp;
}

// Check if OTP has expired
function isOTPExpired(email) {
    const otpData = otpStore[email];
    if (!otpData) {
        console.error(`No OTP found for email: ${email}`); // Log if no OTP exists
        return true; // Treat as expired if no OTP exists
    }

    const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
    const currentTime = Date.now();

    // Check if the OTP has expired
    const isExpired = (currentTime - otpData.timestamp) > OTP_EXPIRATION_TIME;
    if (isExpired) {
        console.log(`OTP for ${email} has expired.`);
    }
    return isExpired;
}
// Send Password Reset Confirmation Email
const sendPasswordResetConfirmationEmail = (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'demonultimate9@gmail.com',
            pass: 'xexm vjid rina cxrf' // Use app password
        }
    });

    const mailOptions = {
        from: 'demonultimate9@gmail.com', // Sender address
        to: email, // Receiver email
        subject: 'Password Reset Successful',
        text: `Hello,

Your password has been successfully reset. If you didn't request this change, please contact our support immediately.

Thank you,
Your Application Team`, // Plain text body
        html: `<p>Hello,</p>
               <p>Your password has been successfully reset. If you didn't request this change, please contact our support immediately.</p>
               <p>Thank you,<br>Your Application Team</p>` // HTML body
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error); // Reject promise with error
            } else {
                resolve(info.response); // Resolve promise with response
            }
        });
    });
};


module.exports = {
    generateOTP,
    sendOTPEmail,
    storeOTP,
    isOTPExpired,
    getStoredOTP,
    sendPasswordResetConfirmationEmail
};
