const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',      // Host of the MySQL server (usually localhost)
    user: 'root',           // Username (replace with your MySQL username)
    password: 'BS22@RPBL', // Password (replace with your MySQL password)
    database: 'expense_tracking_system', // The name of your database
});

// Connect to the MySQL server
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database with ID ' + connection.threadId);
});

module.exports = connection;
