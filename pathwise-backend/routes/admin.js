const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', verifyToken, async (req, res) => {
    // Check if the user making the request has the 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only administrators can view this page.' });
    }

    try {
        const [users] = await db.promise().query('SELECT id, name, email, role, contact, address, status, is_verified, student_Id, staff_Id, course, office, windowNo, section, department FROM users');
        res.json({ users });
    } catch (err) {
        console.error('❌ Error fetching users:', err.message);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
});

// Delete a user (Admin only)
router.delete('/profile/:id', verifyToken, async (req, res) => {
    // Check if the user making the request has the 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only administrators can delete users.' });
    }

    const userIdToDelete = parseInt(req.params.id);

    try {
        const [results] = await db.promise().query('DELETE FROM users WHERE id = ?', [userIdToDelete]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ success: true, message: 'User deleted successfully!' });
    } catch (err) {
        console.error('❌ Error deleting user:', err.message);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

// PUT route to update a user (Admin only)
// This endpoint handles the 'edit user' functionality.
router.put('/profile/:id', verifyToken, async (req, res) => {
    // Check if the user making the request has the 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only administrators can update users.' });
    }

    const userIdToUpdate = parseInt(req.params.id);
    const updatedData = req.body;

    // Dynamically build the SQL UPDATE query based on the fields sent in the request body.
    const updateFields = Object.keys(updatedData).filter(key => key !== 'id');
    const updateValues = updateFields.map(key => updatedData[key]);
    const setClause = updateFields.map(field => `\`${field}\` = ?`).join(', ');

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    const values = [...updateValues, userIdToUpdate];

    try {
        const [results] = await db.promise().query(query, values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes were made.' });
        }

        res.json({ success: true, message: 'User updated successfully!' });
    } catch (err) {
        console.error('❌ Error updating user:', err.message);
        res.status(500).json({ message: 'Failed to update user.' });
    }
});

module.exports = router;
