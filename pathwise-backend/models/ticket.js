const db = require('../db');

const Ticket = {
  create: ({ user_id, name, office, service, additional_info, form_data }, callback) => {
    const query = `
      INSERT INTO tickets (user_id, name, office, service, additional_info, form_data, status)
      VALUES (?, ?, ?, ?, ?, ?, 'waiting')
    `;
    db.query(query, [user_id, name, office, service, additional_info, JSON.stringify(form_data)], callback);
  },

  getByUserId: (userId, callback) => {
    const query = 'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC';
    db.query(query, [userId], callback);
  },

  getByOffice: (office, callback) => {
    const query = 'SELECT * FROM tickets WHERE office = ? ORDER BY created_at ASC';
    db.query(query, [office], callback);
  },

  updateStatus: (id, status, callback) => {
    const query = 'UPDATE tickets SET status = ? WHERE id = ?';
    db.query(query, [status, id], callback);
  }
};

module.exports = Ticket;
