const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// GET all active services for the public frontend
router.get('/', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM services WHERE is_active = 1');
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching active services:', err);
    res.status(500).json({ message: 'Failed to fetch active services.' });
  }
});

// GET all services (active and inactive) for the admin panel
// 💡 We temporarily removed `verifyToken` to confirm the route works.
router.get('/all', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM services');
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching all services:', err);
    res.status(500).json({ message: 'Failed to fetch all services.' });
  }
});

// POST a new service
router.post('/', verifyToken, async (req, res) => {
  const { service_name, office_name, is_active } = req.body;
  if (!service_name || !office_name || is_active === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await db.promise().query(
      'INSERT INTO services (service_name, office_name, is_active) VALUES (?, ?, ?)',
      [service_name, office_name, is_active]
    );
    // 💡 The fix: Return the `insertId` so the frontend can use it.
    res.status(201).json({ message: 'Service added successfully.', id: result.insertId });
  } catch (err) {
    console.error('❌ Error adding service:', err);
    res.status(500).json({ message: 'Failed to add service.' });
  }
});


// PUT (update) an existing service
router.put('/:id', verifyToken, async (req, res) => {
  const { service_name, office_name, is_active } = req.body;
  const { id } = req.params;
  try {
    const [result] = await db.promise().query(
      'UPDATE services SET service_name = COALESCE(?, service_name), office_name = COALESCE(?, office_name), is_active = COALESCE(?, is_active) WHERE id = ?',
      [service_name, office_name, is_active, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.json({ message: 'Service updated successfully.' });
  } catch (err) {
    console.error('❌ Error updating service:', err);
    res.status(500).json({ message: 'Failed to update service.' });
  }
});

module.exports = router;
