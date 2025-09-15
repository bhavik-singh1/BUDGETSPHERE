const express = require('express');
const router = express.Router();
const db = require("../services/database");  // Import your database connection
const authenticateToken = require('../middleware/authenticateToken'); // Import the JWT authentication middleware
const checkAdmin = require('../middleware/checkAdmin'); // Import your admin check middleware



// Add Expense Category (Admin Only)
router.post('/expense/category', authenticateToken, checkAdmin, (req, res) => {
    const { categoryName, description } = req.body;

    if (!categoryName) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const query = `INSERT INTO expense_categories (name, description) VALUES (?, ?)`;

    db.query(query, [categoryName, description || null], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding category', error: err });
        }
        res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
    });
});

// Update Expense Category (Admin Only)
router.put('/expense/category/:id', authenticateToken, checkAdmin, (req, res) => {
    const { id } = req.params;
    const { categoryName, description } = req.body;

    if (!categoryName && description === undefined) {
        return res.status(400).json({ message: 'At least one field (categoryName or description) is required to update' });
    }

    let updateFields = [];
    let queryValues = [];

    if (categoryName) {
        updateFields.push('name = ?');
        queryValues.push(categoryName);
    }

    if (description !== undefined) {
        updateFields.push('description = ?');
        queryValues.push(description);
    }

    queryValues.push(id);

    const query = `UPDATE expense_categories SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, queryValues, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating category', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    });
});

// Delete Expense Category (Admin Only)
router.delete('/expense/category/:id', authenticateToken, checkAdmin, (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM expense_categories WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting category', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    });
});

// View All Expense Categories (Admin Only)
router.get('/expense/categories', authenticateToken, checkAdmin, (req, res) => {
    const query = `SELECT id, name, description FROM expense_categories`;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching categories', error: err });
        }
        res.status(200).json(results);
    });
});

module.exports = router;