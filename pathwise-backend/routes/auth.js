const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const {
    name, email, password, role,
    studentId, staffId,
    course, office, windowNo, section, department
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  const allowedRoles = ['student', 'staff', 'admin', 'visitor'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be student, staff, admin, or visitor.' });
  }

  if (role === 'student' && (!studentId || !course)) {
    return res.status(400).json({ message: 'Student ID and course are required for student role.' });
  }

  if (role === 'staff') {
    if (!staffId || !office) {
      return res.status(400).json({ message: 'Staff ID and office are required for staff role.' });
    }

    if (office === 'Registrar' && !windowNo) {
      return res.status(400).json({ message: 'Window is required for Registrar office.' });
    }

    if (office === 'Library' && !section) {
      return res.status(400).json({ message: 'Section is required for Library office.' });
    }

    if (office === 'Departmental' && !department) {
      return res.status(400).json({ message: 'Department is required for Departmental office.' });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users
        (name, email, password, role, student_Id, staff_Id, course, office, windowNo, section, department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      name,
      email,
      hashedPassword,
      role,
      role === 'student' ? studentId : null,
      role === 'staff' ? staffId : null,
      role === 'student' ? course : null,
      role === 'staff' ? office : null,
      office === 'Registrar' ? windowNo : null,
      office === 'Library' ? section : null,
      office === 'Departmental' ? department : null
    ], (err, result) => {
      if (err) {
        console.error('❌ Registration failed:', err.message);
        return res.status(500).json({ message: 'Registration error.' });
      }

      res.status(201).json({ message: 'User registered successfully.' });
    });

  } catch (err) {
    console.error('❌ Hashing error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});


// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password, role, name, address, contact } = req.body;

 if (role === 'visitor') {
  if (!name || !address || !contact) {
    return res.status(400).json({ message: 'Please provide all visitor info.' });
  }

  const insertVisitorQuery = `
    INSERT INTO visitors (name, address, contact, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertVisitorQuery, [name, address, contact, 'visitor'], (err, result) => {
    if (err) {
      console.error('❌ Visitor DB Error:', err.message);
      return res.status(500).json({ message: 'Visitors login failed.' });
    }

    return res.status(200).json({
      message: 'Visitor login successful',
      user: {
        id: result.insertId,
        name,
        address,
        contact,
        role: 'visitor'
      }
    });
  });

  return;
}

  // For student/staff/admin
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1`;

  db.query(query, [email, role], async (err, results) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Account not found for this role.' });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          course: user.course,
          office: user.office,
          studentId: user.student_Id,
          staffId: user.staff_Id,
          windowNo: user.windowNo,
          section: user.section,
          department: user.department
        }
      });

    } catch (compareErr) {
      console.error('❌ Compare error:', compareErr.message);
      return res.status(500).json({ message: 'Password comparison error.' });
    }
  });
});


module.exports = router;
