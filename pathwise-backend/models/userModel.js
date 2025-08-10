const db = require('../db');

const createUser = (userData, callback) => {
  const { name, email, password, role, student_id, staff_id } = userData;

  const query = `
    INSERT INTO users (name, email, password, role, student_id, staff_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, password, role, student_id || null, staff_id || null],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    }
  );
};

const updateUser = (userId, userData, callback) => {
  const { name, email, contact, address, course } = userData;

  const query = `
    UPDATE users
    SET name = ?, email = ?, contact = ?, address = ?, course = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [name, email, contact, address, course, userId],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    }
  );
};

module.exports = { createUser, updateUser };
