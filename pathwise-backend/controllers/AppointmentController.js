const db = require('../db');
const Appointment = require('../models/Appointment');
const Ticket = require('../models/Ticket');

function bookAppointment(req, res) {
  const { user_id, name, office, service, date, time, additional_info, priority_lane } = req.body;

  // Convert "HH:mm" -> hour int (9..16)
  const hour = new Date(`1970-01-01T${time}:00Z`).getUTCHours();

  Appointment.isSlotAvailable(date, hour, office, (err, available) => {
    if (err) return res.status(500).json({ error: 'DB error checking slot' });
    if (!available) return res.status(400).json({ error: 'This office is fully booked for that hour.' });

     Appointment.create(
    { user_id, name, office, service, date, time, additional_info, priority_lane },
    (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error creating appointment' });
      // Add this line to see the full result object
      console.log('Appointment creation result:', result);
      res.json({ success: true, id: result.insertId });
    }
    );
  });
}

function confirmAppointment(req, res) {
  const { appointmentId } = req.body;

  // 1) Mark appointment confirmed
  Appointment.confirm(appointmentId, (err) => {
    if (err) return res.status(500).json({ error: 'DB error confirming appointment' });

    // 2) Load appointment to mirror details into ticket
    db.query(`SELECT * FROM appointments WHERE id = ?`, [appointmentId], (err, rows) => {
      if (err || rows.length === 0) return res.status(404).json({ error: 'Appointment not found' });
      const appt = rows[0];

      // 2.1) Prevent duplicate active ticket in same office
      const dupSql = `
        SELECT id FROM tickets
        WHERE user_id = ? AND office = ? AND status NOT IN ('done','cancelled')
        LIMIT 1
      `;
      db.query(dupSql, [appt.user_id, appt.office], (err, existing) => {
        if (err) return res.status(500).json({ error: 'DB error duplicate check' });
        if (existing.length > 0) {
          return res.status(400).json({ error: 'You already have an active ticket in this office.' });
        }

        // 3) Create ticket with SAME details + priority
        const formData = {
          appointmentId: appt.id,
          appointment_date: appt.appointment_date,
          appointment_time: appt.appointment_time,
          via: 'appointment'
        };

        Ticket.create(
          {
            user_id: appt.user_id,
            name: appt.name,                    // keep same name
            office: appt.office,
            service: appt.service,
            additional_info: appt.additional_info, // SAME JSON from request form
            form_data: JSON.stringify(formData),   // keep appointment context
            priority_lane: 1                       // reservation users prioritized
          },
          (err, ticketResult) => {
            if (err) return res.status(500).json({ error: 'DB error creating ticket' });
            res.json({ success: true, ticketId: ticketResult.insertId });
          }
        );
      });
    });
  });
}

function getUserAppointments(req, res) {
  const { userId } = req.params;
  Appointment.getByUser(userId, (err, appts) => {
    if (err) return res.status(500).json({ error: 'DB error fetching appointments' });
    res.json(appts);
  });
}

function getAvailableSlots(req, res) {
  const { office, date } = req.params;

  // Build 09:00 .. 16:00
  const slots = [];
  for (let h = 9; h <= 16; h++) {
    const hh = h.toString().padStart(2, '0');
    slots.push(`${hh}:00`);
  }

  const sql = `
    SELECT DATE_FORMAT(appointment_time, '%H:%i') AS hhmm, COUNT(*) AS count
    FROM appointments
    WHERE appointment_date = ?
      AND office = ?
      AND status IN ('pending','confirmed')
    GROUP BY hhmm
  `;

  db.query(sql, [date, office], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error fetching slots' });

    const booked = Object.fromEntries(results.map(r => [r.hhmm, r.count]));
    const payload = slots.map(time => ({
      time,                          // "09:00"
      available: (booked[time] || 0) < 10
    }));

    res.json({ slots: payload });
  });
}

// ✅ Corrected getAppointmentById function with aliases
function getAppointmentById(req, res) {
  const { id } = req.params;
  const sql = `
    SELECT
      id,
      user_id,
      name,
      office,
      service,
      additional_info,
      priority_lane,
      status,
      appointment_date AS date,
      appointment_time AS time
    FROM appointments
    WHERE id = ?
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching appointment:', err);
      return res.status(500).json({ error: 'DB error fetching appointment' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(rows[0]);
  });
}

module.exports = {
  bookAppointment,
  confirmAppointment,
  getUserAppointments,
  getAvailableSlots,
  getAppointmentById 
};
