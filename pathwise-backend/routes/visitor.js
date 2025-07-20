const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/add', (req, res) => {
  const { full_name, contact, address } = req.body;

  if (!full_name) return res.status(400).json({ message: 'Full name is required.' });

  const sql = 'INSERT INTO visitors (full_name, contact, address) VALUES (?, ?, ?)';
  db.query(sql, [full_name, contact || null, address || null], (err, result) => {
    if (err) {
      console.error('❌ Visitor insert error:', err.message);
      return res.status(500).json({ message: 'Error adding visitor.' });
    }
    res.status(201).json({ message: 'Visitor recorded successfully.' });
  });
});

module.exports = router;
