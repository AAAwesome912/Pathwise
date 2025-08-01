const db = require('../db');

const Ticket = {
  create: ({ user_id, name, office, service, additional_info, form_data }, callback) => {
    const getMaxQuery = `SELECT MAX(office_ticket_no) AS maxNo FROM tickets WHERE office = ?`;

    db.query(getMaxQuery, [office], (err, results) => {
      if (err) return callback(err);

      const nextTicketNo = (results[0].maxNo || 0) + 1;

      const insertQuery = `
        INSERT INTO tickets 
          (user_id, name, office, service, additional_info, form_data, status, office_ticket_no)
        VALUES (?, ?, ?, ?, ?, ?, 'waiting', ?)
      `;

      db.query(
        insertQuery,
        [user_id, name, office, service, additional_info, JSON.stringify(form_data), nextTicketNo],
        callback
      );
    });
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
  },

  countWaitingByOffice: (office, callback) => {
    const query = `
      SELECT COUNT(*) AS waiting 
      FROM tickets
      WHERE office = ? AND status = 'waiting'
    `;
    db.query(query, [office], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0].waiting);
    });
  },

  resetAllOfficeTicketNos: (callback) => {
    const query = `UPDATE tickets SET office_ticket_no = NULL`;
    db.query(query, callback);
  },

  resetOfficeTicketNo: (office, callback) => {
  const query = `UPDATE tickets SET office_ticket_no = NULL WHERE office = ?`;
  db.query(query, [office], callback);
},


  cancelTicket: (id, callback) => {
    const query = `
      UPDATE tickets
      SET status = 'cancelled'
      WHERE id = ? AND status NOT IN ('done', 'cancelled')
    `;
    db.query(query, [id], callback);
  }
};


module.exports = Ticket;
