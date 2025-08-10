const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  const {
    name, email, contact, address, password, role,
    studentId, staffId,
    course, office, windowNo, section, department
  } = req.body;

  if (!name || !email || !address || !password || !role) {
    return res.status(400).json({ message: 'Name, email, address, password, and role are required.' });
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
    const [existing] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users
        (name, email, contact, address, password, role, student_Id, staff_Id, course, office, windowNo, section, department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.promise().query(query, [
      name, email, contact, address, hashedPassword, role,
      role === 'student' ? studentId : null,
      role === 'staff' ? staffId : null,
      role === 'student' ? course : null,
      role === 'staff' ? office : null,
      office === 'Registrar' ? windowNo : null,
      office === 'Library' ? section : null,
      office === 'Departmental' ? department : null
    ]);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  const { email, password, role, name, address, contact } = req.body;

  // Visitor login
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

      // Optionally generate a token for visitor (can be used for session management)
      const visitorToken = jwt.sign(
        { id: result.insertId, name, role: 'visitor' },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Visitor login successful',
        token: visitorToken,
        user: {
          id: result.insertId,
          name,
          address,
          contact,
          role: 'visitor'
        }
      });
    });

    return; // Important to prevent further execution
  }

  // Student, Staff, Admin login
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  try {
    const [results] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1',
      [email, role]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: 'Account not found for this role.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    await db.promise().query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
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
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// -------------------- GET ME --------------------
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!results.length) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
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
  } catch (err) {
    console.error('❌ /me error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------- LOGOUT --------------------
router.post('/logout', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'User ID required for logout' });

  try {
    await db.promise().query('UPDATE users SET token = NULL WHERE id = ?', [id]);
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('❌ Logout error:', err.message);
    res.status(500).json({ message: 'Logout failed' });
  }
});

router.put('/profile/:id', verifyToken, async (req, res) => {
  const userIdFromToken = req.user.id; 
  const userIdFromUrl = parseInt(req.params.id);

  // Security check: Ensure the user can only edit their own profile
  if (userIdFromToken !== userIdFromUrl) {
    return res.status(403).json({ message: 'Forbidden: You can only edit your own profile.' });
  }

  // Dynamically build the update query to only update fields that are provided
  const updateFields = Object.keys(req.body);
  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields to update.' });
  }
  
  const setClauses = updateFields.map(field => `${field} = ?`).join(', ');
  const values = updateFields.map(field => req.body[field]);
  values.push(userIdFromUrl);

  try {
    const query = `
      UPDATE users
      SET ${setClauses}
      WHERE id = ?
    `;

    const [results] = await db.promise().query(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made.' });
    }

    // Fetch the updated user data to send back to the client
    const [updatedUser] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userIdFromUrl]);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        contact: updatedUser[0].contact,
        address: updatedUser[0].address,
        role: updatedUser[0].role,
        course: updatedUser[0].course,
        office: updatedUser[0].office,
        studentId: updatedUser[0].student_Id,
        staffId: updatedUser[0].staff_Id,
        windowNo: updatedUser[0].windowNo,
        section: updatedUser[0].section,
        department: updatedUser[0].department
      }
    });
  } catch (err) {
    console.error('❌ Profile update error:', err.message);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;

