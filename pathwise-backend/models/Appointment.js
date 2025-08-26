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

  // Create a new appointment
  create: (data, callback) => {
    const { user_id, name, office, service, date, time, additional_info, priority_lane } = data;
    const sql = `
      INSERT INTO appointments (user_id, name, office, service, appointment_date, appointment_time, additional_info, priority_lane)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [user_id, name, office, service, date, time, JSON.stringify(additional_info), priority_lane];
    db.query(sql, values, callback);
  },
  
  // This is the new logic to confirm an appointment
  confirm: (id, callback) => {
    const sql = `UPDATE appointments SET status = 'confirmed' WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error confirming appointment in model:', err);
        return callback(err);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('Appointment not found or already confirmed.'));
      }
      callback(null);
    });
  },

  confirm: (appointmentId, callback) => {
    const sql = `UPDATE appointments SET status='confirmed' WHERE id = ?`;
    db.query(sql, [appointmentId], callback);
  },

  // Get appointments by user ID
  getByUser: (userId, callback) => {
    const sql = `
      SELECT id, user_id, name, office, service, additional_info, priority_lane, status, appointment_date, appointment_time
      FROM appointments
      WHERE user_id = ?
      ORDER BY appointment_date DESC, appointment_time DESC
    `;
    db.query(sql, [userId], callback);
  }
};

 
module.exports = Appointment;
