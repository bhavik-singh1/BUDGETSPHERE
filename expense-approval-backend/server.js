const cors = require("cors");
const express = require('express');
const { body, validationResult } = require('express-validator');
// const emailservice = require('./services/emailservice'); 
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const app = express();
const authRoutes = require("./routes/authRoutes"); // Import authRoutes
const bodyParser = require("body-parser");
const registerRoutes = require("./routes/registerRoutes"); // Import registration routes
const loginRoutes = require("./routes/loginRoutes"); // Import login routes
const userProfileRoutes = require('./routes/userProfileRoutes'); // Import user profile routes
const expenseCategoryRoutes = require('./routes/expenseCategoryRoutes'); // Import the routes for expense categories
const authenticateToken = require('./middleware/authenticateToken'); // Correct path to the file
const checkAdmin = require('./middleware/checkAdmin');


// const passwordSchema = Joi.string()
//     .min(6)
//     .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
//     .required();
// const emailSchema = Joi.string().email().required();

// const jwtSecret = 'supersecretkey123456790!@#';
app.use(bodyParser.json());
app.use(express.json()); 
app.use("/user", authRoutes); // Use the routes for authentication
app.use("/user", registerRoutes);
app.use("/user", loginRoutes);
app.use('/user', userProfileRoutes); // Add the user profile routes
app.use('/admin', expenseCategoryRoutes); // This ensures all expense category routes are under the '/admin' path

// const cors = require("cors");

// Allow frontend (port 3000) to access backend (port 4000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
 
app.use(cors());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BS22@RPBL', 
    database: 'expense_tracking_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});


// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     jwt.verify(token, jwtSecret, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid or expired token' });
//         }
//         req.user = user;
//         next();
//     });
// }
// // Middleware to check if the user is an admin
// function checkAdmin(req, res, next) {
//     if (req.user.post !== 'admin') {
//         return res.status(403).json({ message: 'Access denied: Only admins can perform this action' });
//     }
//     next();
// }



// // API endpoint to request OTP (e.g., for password reset)
// app.post('/user/forgot-password', async (req, res) => {
//     const { email } = req.body;

//     // Validate email in the request body
//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }

//     try {
//         // Check if the email exists in the database
//         db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//             if (err) {
//                 console.error('Database query error:', err);
//                 return res.status(500).json({ message: 'Database error. Please try again later.' });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ message: 'Email not found in our database' });
//             }

//             // Generate OTP
//             const otp = emailservice.generateOTP();

//             try {
//                 // Send OTP email to the user
//                 await emailservice.sendOTPEmail(email, otp);

//                 // Store OTP temporarily
//                 emailservice.storeOTP(email, otp);

//                 res.status(200).json({ message: 'OTP sent to email' });
//             } catch (emailError) {
//                 console.error('Error during OTP email sending:', emailError);
//                 return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
//             }
//         });
//     } catch (error) {
//         console.error('Unexpected error during OTP generation or sending:', error);
//         res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
//     }
// });

// API endpoint to verify OTP
// app.post('/user/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({ message: 'Email and OTP are required' });
//     }

//     console.log(`Received OTP: ${otp} for email: ${email}`);

//     try {
//         // Check if OTP exists for the email address
//         const storedOTP = emailservice.getStoredOTP(email);
//         if (!storedOTP) {
//             return res.status(400).json({ message: 'No OTP found for this email address' });
//         }

//         console.log(`Stored OTP for ${email}: ${storedOTP}`);

//         // Check if OTP has expired
//         if (emailservice.isOTPExpired(email)) {
//             return res.status(400).json({ message: 'OTP has expired' });
//         }

//         // Compare received OTP with stored OTP
//         if (storedOTP !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         res.status(200).json({ message: 'OTP verified successfully' });
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).json({ message: 'An error occurred during OTP verification.' });
//     }
// });


// Reset Password Route
// app.post('/user/reset-password', async (req, res) => {
//     const { email, newPassword, otp } = req.body;

//     // Validate request body fields
//     if (!email || !newPassword || !otp) {
//         return res.status(400).json({ message: 'Email, OTP, and new password are required' });
//     }

//     // Validate email format
//     const emailValidation = emailSchema.validate(email);
//     if (emailValidation.error) {
//         return res.status(400).json({ message: 'Invalid email format' });
//     }

//     // Validate password complexity
//     const passwordValidation = passwordSchema.validate(newPassword);
//     if (passwordValidation.error) {
//         return res.status(400).json({ message: 'Password does not meet complexity requirements' });
//     }

//     try {
//         // Step 1: Verify OTP
//         const storedOTP = emailservice.getStoredOTP(email);
//         if (!storedOTP) {
//             return res.status(400).json({ message: 'No OTP found for this email address' });
//         }

//         if (emailservice.isOTPExpired(email)) {
//             return res.status(400).json({ message: 'OTP has expired' });
//         }

//         if (storedOTP !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         // Step 2: Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Step 3: Update the password in the database
//         db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], async (err, result) => {
//             if (err) {
//                 console.error('Database update error:', err);
//                 return res.status(500).json({ message: 'Error updating password. Please try again later.' });
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Step 4: Send password reset confirmation email
//             try {
//                 await emailservice.sendPasswordResetConfirmationEmail(email);
//                 return res.status(200).json({ message: 'Password reset successfully. A confirmation email has been sent.' });
//             } catch (emailError) {
//                 console.error('Error sending confirmation email:', emailError);
//                 return res.status(500).json({ message: 'Password reset successful, but confirmation email failed to send.' });
//             }
//         });
//     } catch (error) {
//         console.error('Error during password reset:', error);
//         res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
//     }
// });



// // View User Profile
// app.get('/user/profile', authenticateToken, (req, res) => {
//     const userId = req.user.id; // Extract user ID from the token

//     const query = `SELECT id, username, email FROM users WHERE id = ?`;

//     db.query(query, [userId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching profile', error: err });
//         }

//         if (result.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(result[0]); // Return the user's profile (without the password)
//     });
// });

// // User Profile Management
// app.put('/user/profile', authenticateToken, (req, res) => {
//     const { username, email, password } = req.body;

//     let updateFields = [];
//     let queryValues = [];

//     if (username) {
//         updateFields.push('username = ?');
//         queryValues.push(username);
//     }

//     if (email) {
//         updateFields.push('email = ?');
//         queryValues.push(email);
//     }

//     if (password) {
//         const hashedPassword = bcrypt.hashSync(password, 10);
//         updateFields.push('password = ?');
//         queryValues.push(hashedPassword);
//     }

//     queryValues.push(req.user.id);
//     const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

//     db.query(query, queryValues, (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating profile', error: err });
//         }
//         res.status(200).json({ message: 'Profile updated successfully' });
//     });
// });

// Registration Route
// app.post('/register', async (req, res) => {
//     const { username, password, email } = req.body;

//     // Validate inputs
//     if (!username || !password || !email) {
//         return res.status(400).json({ message: 'Username, password, and email are required' });
//     }

//     // Validate email format
//     const emailValidation = emailSchema.validate(email);
//     if (emailValidation.error) {
//         return res.status(400).json({ message: 'Invalid email format' });
//     }

//     // Validate password complexity
//     const passwordValidation = passwordSchema.validate(password);
//     if (passwordValidation.error) {
//         return res.status(400).json({ message: 'Password does not meet complexity requirements' });
//     }

//     try {
//         // Check if username or email already exists in the database
//         const [existingUser] = await db.promise().query(
//             'SELECT * FROM users WHERE username = ? OR email = ?',
//             [username, email]
//         );

//         if (existingUser.length > 0) {
//             return res.status(400).json({ message: 'Username or email already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert new user into the database
//         const [result] = await db.promise().query(
//             'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
//             [username, hashedPassword, email]
//         );

//         // Generate a JWT token for the registered user
//         const token = jwt.sign(
//             { id: result.insertId, username, email },
//             jwtSecret,
//             { expiresIn: '1h' }
//         );

//         return res.status(201).json({
//             message: 'User registered successfully',
//             token,
//         });
//     } catch (err) {
//         console.error('Error during registration:', err);
//         return res.status(500).json({
//             message: 'An error occurred during registration',
//             error: err.message,
//         });
//     }
// });
// // User Login
// app.post('/login', async (req, res) => {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//         return res.status(400).json({ message: 'Username, email, and password are required' });
//     }

//     const query = 'SELECT * FROM users WHERE username = ? AND email = ?';
//     db.query(query, [username, email], async (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error checking user', error: err });
//         }

//         if (result.length !== 1) {
//             return res.status(400).json({ message: 'Invalid username, email, or password' });
//         }

//         const user = result[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(400).json({ message: 'Invalid username, email, or password' });
//         }

//         // Create access token (short expiry)
//         const accessToken = jwt.sign(
//             { id: user.id, username: user.username, email: user.email, post: user.post },
//             jwtSecret,
//             { expiresIn: '1h' } // 1 hour expiration
//         );

//         // Create refresh token (longer expiry)
//         const refreshToken = jwt.sign(
//             { id: user.id, username: user.username, email: user.email, post: user.post },
//             jwtSecret,
//             { expiresIn: '7d' } // 7 days expiration
//         );

//         // Optionally, store refresh token in the database if needed
//         // db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

//         res.status(200).json({
//             message: 'Login successful',
//             accessToken,
//             refreshToken,
//             user: { id: user.id, username: user.username, email: user.email, post: user.post }
//         });
//     });
// });

// // Add Expense Category (Admin Only)
// app.post('/expense/category', authenticateToken, checkAdmin, (req, res) => {
//     const { categoryName, description } = req.body;

//     if (!categoryName) {
//         return res.status(400).json({ message: 'Category name is required' });
//     }

//     const query = `INSERT INTO expense_categories (name, description) VALUES (?, ?)`;

//     db.query(query, [categoryName, description || null], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error adding category', error: err });
//         }
//         res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
//     });
// });

// // Update Expense Category (Admin Only)
// app.put('/expense/category/:id', authenticateToken, checkAdmin, (req, res) => {
//     const { id } = req.params;
//     const { categoryName, description } = req.body;

//     if (!categoryName && description === undefined) {
//         return res.status(400).json({ message: 'At least one field (categoryName or description) is required to update' });
//     }

//     let updateFields = [];
//     let queryValues = [];

//     if (categoryName) {
//         updateFields.push('name = ?');
//         queryValues.push(categoryName);
//     }

//     if (description !== undefined) { // Explicitly check for undefined
//         updateFields.push('description = ?');
//         queryValues.push(description);
//     }

//     queryValues.push(id);

//     const query = `UPDATE expense_categories SET ${updateFields.join(', ')} WHERE id = ?`;

//     db.query(query, queryValues, (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating category', error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
//         res.status(200).json({ message: 'Category updated successfully' });
//     });
// });

// // Delete Expense Category (Admin Only)
// app.delete('/expense/category/:id', authenticateToken, checkAdmin, (req, res) => {
//     const { id } = req.params;

//     const query = `DELETE FROM expense_categories WHERE id = ?`;

//     db.query(query, [id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error deleting category', error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
//         res.status(200).json({ message: 'Category deleted successfully' });
//     });
// });

// // View All Expense Categories (Admin Only)
// app.get('/expense/categories', authenticateToken, checkAdmin, (req, res) => {
//     const query = `SELECT id, name, description FROM expense_categories`;

//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching categories', error: err });
//         }
//         res.status(200).json(results);
//     });
// });

// Route to refresh the access token
app.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        // Create a new access token
        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email, post: user.post },
            jwtSecret,
            { expiresIn: '1h' } // New access token with a 1-hour expiration
        );

        res.status(200).json({ accessToken: newAccessToken });
    });
});

// Joi validation schema for the 'expense' object
const expenseSchema = Joi.object({
    description: Joi.string().min(3).max(255).required(),
    amount: Joi.number().greater(0).required(),
    category: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid('pending', 'approved', 'rejected').default('pending')
});

// POST route for creating an expense using Joi validation
app.post('/api/expenses', authenticateToken, async (req, res) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { description, amount, category, status } = req.body;
    const user_id = req.user.id;  // Get the user ID from the JWT token

    const query = 'INSERT INTO expenses (description, amount, category, status, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [description, amount, category, status, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding expense', error: err });
        }
        res.status(201).json({ message: 'Expense created successfully', id: result.insertId });
    });
});

// PUT route to approve an expense (Admin-only)
app.put('/api/expenses/:id/approve', authenticateToken, checkAdmin, (req, res) => {
    const { id } = req.params;

    const query = 'UPDATE expenses SET status = ? WHERE id = ?';
    db.query(query, ['approved', id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error approving expense', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense approved successfully' });
    });
});

// PUT route to reject an expense (Admin-only)
app.put('/api/expenses/:id/reject', authenticateToken, checkAdmin, (req, res) => {
    const { id } = req.params;

    const query = 'UPDATE expenses SET status = ? WHERE id = ?';
    db.query(query, ['rejected', id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error rejecting expense', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense rejected successfully' });
    });
});

// GET route for fetching all expenses of the logged-in user
app.get('/api/expenses', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(query, [req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching expenses', error: err });
        }
        res.status(200).json(result);
    });
});

// GET route for fetching a specific expense by ID
app.get('/api/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM expenses WHERE id = ? AND user_id = ?';
    db.query(query, [id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching expense', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(result[0]);
    });
});

// DELETE route for deleting an expense
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
    db.query(query, [id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting expense', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    });
});
app.get('/report/user/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user expenses from the database
        const [expenses] = await db.promise().query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY date_submitted DESC',
            [userId]
        );

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for this user' });
        }

        // Create a PDF report
        const doc = new PDFDocument({ margin: 30 });
        let filename = `User_Report_${userId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        doc.pipe(res);
       
       // Add a title below the logo
       doc.moveDown(2); // Add space after the logo
     
        doc.fontSize(20).text('Expense Report', { align: 'center' }).moveDown(2);

        // Add user details
        doc.fontSize(14).text(`User ID: ${userId}`);
        doc.moveDown(1);

        // Add a table header
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('S.No.', { width: 50, align: 'left' })
            .text('Date Submitted', { width: 120, align: 'left' })
            .text('Amount', { width: 80, align: 'right' })
            .text('Category', { width: 100, align: 'left' })
            .text('Status', { width: 80, align: 'left' })
            .moveDown();

        doc.font('Helvetica');

        // Add table rows for expenses
        expenses.forEach((expense, index) => {
            const amount = parseFloat(expense.amount) || 0; // Ensure amount is a valid number

            doc.text(index + 1, { width: 50, align: 'left' })
                .text(new Date(expense.date_submitted).toLocaleDateString(), { width: 120, align: 'left' })
                .text(`₹${amount.toFixed(2)}`, { width: 80, align: 'right' }) // Format the amount
                .text(expense.category, { width: 100, align: 'left' })
                .text(expense.status, { width: 80, align: 'left' })
                .moveDown(0.5);
        });

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).text('Generated on ' + new Date().toLocaleString(), { align: 'right' });

        doc.end(); // Finalize the PDF
    } catch (err) {
        console.error('Error generating report:', err);
        return res.status(500).json({ message: 'Error generating report', error: err.message });
    }
});


//To provide reports in Excel format:
app.get('/report/user/excel/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const [expenses] = await db.promise().query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY date_submitted DESC',
            [userId]
        );

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for this user' });
        }

        // Convert data to Excel sheet
        const worksheet = XLSX.utils.json_to_sheet(expenses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

        // Write Excel file
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=User_Report.xlsx');
        res.send(buffer);
    } catch (err) {
        console.error('Error generating Excel report:', err);
        return res.status(500).json({ message: 'Error generating Excel report', error: err.message });
    }
});
//reports for admin
app.get('/report/admin/summary', authenticateToken, checkAdmin, async (req, res) => {
    try {
        // Fetch summarized data
        const [summary] = await db.promise().query(`
            SELECT 
                category, 
                COUNT(*) AS total_expenses, 
                SUM(amount) AS total_amount 
            FROM expenses 
            GROUP BY category
        `);

        return res.status(200).json({ message: 'Summary fetched successfully', summary });
    } catch (err) {
        console.error('Error fetching summary:', err);
        return res.status(500).json({ message: 'Error fetching summary', error: err.message });
    }
});









// Start server
app.listen(4000, () => console.log("Server running on port 4000"));