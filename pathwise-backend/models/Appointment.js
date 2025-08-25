const db = require('../db');

const Appointment = {
  // per office, max 10 per hour
  isSlotAvailable: (date, hour, office, callback) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE appointment_date = ?
        AND HOUR(appointment_time) = ?
        AND office = ?
        AND status IN ('pending','confirmed')
    `;
    db.query(sql, [date, hour, office], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count < 10);
    });
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO appointments
        (user_id, name, office, service, appointment_date, appointment_time, additional_info, priority_lane, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    db.query(
      sql,
      [
        data.user_id,
        data.name,
        data.office,
        data.service,
        data.date,
        data.time,
        data.additional_info || null,
        data.priority_lane ? 1 : 0
      ],
      callback
    );
  },

  confirm: (appointmentId, callback) => {
    const sql = `UPDATE appointments SET status='confirmed' WHERE id = ?`;
    db.query(sql, [appointmentId], callback);
  },

  getByUser: (userId, callback) => {
    db.query(`SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date, appointment_time`, [userId], callback);
  }
};
 
module.exports = Appointment;
