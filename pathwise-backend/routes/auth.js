const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const verifyToken = require('../middleware/verifyToken');
const db = require('../db');
const nodemailer = require('nodemailer');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Function to send a verification email with a 6-digit code
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification',
    html: `
      <div style="font-family: sans-serif; text-align: center; color: #333;">
        <h2 style="color: #4CAF50;">Welcome!</h2>
        <p>Thank you for registering. Please use the following 6-digit code to verify your email address:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background-color: #f1f1f1; display: inline-block; border-radius: 5px;">
           ${code}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">
          If you did not sign up for this, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email with 6-digit code sent to ${email}`);
  } catch (err) {
    console.error('❌ Error sending verification email:', err);
  }
};

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
    const [existingUser] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email is already registered. Please log in.' });
    }
    
    const [existingPendingUser] = await db.promise().query('SELECT id FROM pending_users WHERE email = ?', [email]);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number

    if (existingPendingUser.length > 0) {
        await db.promise().query('UPDATE pending_users SET verification_code = ? WHERE email = ?', [verificationCode, email]);
        await sendVerificationEmail(email, verificationCode);
        return res.status(200).json({ message: 'A new verification code has been sent to your email.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO pending_users
        (name, email, contact, address, password, role, student_Id, staff_Id, course, office, windowNo, section, department, verification_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.promise().query(query, [
      name, email, contact, address, hashedPassword, role,
      role === 'student' ? studentId : null,
      role === 'staff' ? staffId : null,
      role === 'student' ? course : null,
      role === 'staff' ? office : null,
      office === 'Registrar' ? windowNo : null,
      office === 'Library' ? section : null,
      office === 'Departmental' ? department : null,
      verificationCode
    ]);

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'User registered. Please check your email for the verification code.' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// -------------------- VERIFY EMAIL --------------------
router.post('/verify-email', async (req, res) => {
  const { code, email } = req.body; // Expecting code and email from a form

  if (!code || !email) {
    return res.status(400).json({ message: 'Email and verification code are required.' });
  }

  try {
    const [pendingUser] = await db.promise().query(
      'SELECT * FROM pending_users WHERE verification_code = ? AND email = ?',
      [code, email]
    );

    if (pendingUser.length === 0) {
      return res.status(404).json({ message: 'Invalid verification code or email.' });
    }

    const user = pendingUser[0];

    const insertQuery = `
      INSERT INTO users
        (name, email, contact, address, password, role, student_Id, staff_Id, course, office, windowNo, section, department, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    await db.promise().query(insertQuery, [
      user.name, user.email, user.contact, user.address, user.password, user.role,
      user.student_Id, user.staff_Id, user.course, user.office, user.windowNo, user.section, user.department
    ]);

    await db.promise().query('DELETE FROM pending_users WHERE id = ?', [user.id]);

    res.status(200).json({ message: 'Email successfully verified. You can now log in.' });

  } catch (err) {
    console.error('❌ Verification error:', err.message);
    res.status(500).json({ message: 'Email verification failed.' });
  }
});

// ... (The rest of the code, including login, verify-token, etc., remains the same) ...
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

      const visitorToken = jwt.sign(
        { id: result.insertId, name, role: 'visitor' },
        SECRET_KEY,
        { expiresIn: '2h' }
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

    return;
  }

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

    if (!user.is_verified) {
      return res.status(401).json({ message: 'Please verify your email to log in.' });
    }

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
router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

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

  if (userIdFromToken !== userIdFromUrl) {
    return res.status(403).json({ message: 'Forbidden: You can only edit your own profile.' });
  }

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