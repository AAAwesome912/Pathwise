const db = require('../db');
const Appointment = require('../models/Appointment');
const Ticket = require('../models/Ticket');
const twilio = require('twilio');

// Initialize the Twilio client with account credentials from environment variables.
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Placeholder for an email sending function.
// Replace with your actual email service integration (e.g., Nodemailer).
const sendEmail = async (to, subject, body) => {
  // Example using a placeholder. You would implement this with a library like Nodemailer
  console.log(`✉️ Email sent to ${to} with subject: ${subject}`);
  console.log(`Body: ${body}`);
  return true;
};

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

  // Mark appointment as 'confirmed' and nothing else
  Appointment.confirm(appointmentId, (err) => {
    if (err) {
      console.error('DB error confirming appointment:', err);
      return res.status(500).json({ error: 'DB error confirming appointment' });
    }
    // The student's app simply needs a success message to know the confirmation was received.
    res.json({ success: true, message: 'Appointment confirmed for in-campus visit.' });
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

  // Get today's date in YYYY-MM-DD format for comparison
  const today = new Date().toISOString().split('T')[0];

  // Check if the requested date is in the past or is today.
  // Note: This comparison works reliably for YYYY-MM-DD formatted strings.
  if (date <= today) {
    return res.status(400).json({ error: 'Cannot make an appointment for today or a past day.' });
  }

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
      time,
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

function cancelAppointment(req, res) {
  const { id } = req.params;
  const sql = `UPDATE appointments SET status = 'cancelled' WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error cancelling appointment:', err);
      return res.status(500).json({ error: 'DB error cancelling appointment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json({ success: true });
  });
}

/**
 * Handles the request from a staff member to notify a student.
 */
async function notifyStudent(req, res) {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required.' });
    }

    // Step 1: Fetch the appointment details and the user's ID from the database.
    const getApptSql = `
      SELECT contact, user_id, office, service, additional_info
      FROM appointments
      WHERE id = ?
    `;

    const [appointment] = await db.query(getApptSql, [appointmentId]);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    
    // Parse the additional_info JSON string to get the contact details.
    let additionalInfo = {};
    try {
      additionalInfo = JSON.parse(appointment.additional_info);
    } catch (e) {
      console.error("Failed to parse additional info:", e);
      return res.status(500).json({ success: false, message: 'Invalid additional info format.' });
    }

    const studentPhoneNumber = additionalInfo.phone_number;
    const studentEmail = additionalInfo.email;
    const studentName = appointment.contact;
    const officeName = appointment.office;

    if (!studentPhoneNumber && !studentEmail) {
        return res.status(404).json({ success: false, message: 'Student contact information (phone number or email) is missing.' });
    }

    // Step 2: Trigger the SMS notification using Twilio if a phone number exists.
    if (studentPhoneNumber) {
      await twilioClient.messages.create({
        to: studentPhoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Hi ${studentName}, your appointment at the ${officeName} is ready. Please come to the office now.`
      });
      console.log(`✅ SMS notification successfully sent for appointment ID: ${appointmentId}`);
    }

    // Step 3: Trigger the email notification if an email address exists.
    if (studentEmail) {
        const emailSubject = `Your Appointment at the ${officeName} is Ready!`;
        const emailBody = `Hi ${studentName},\n\nThis is a friendly reminder that your appointment at the ${officeName} is now ready. Please proceed to the office to claim your service.\n\nThank you!`;
        await sendEmail(studentEmail, emailSubject, emailBody);
    }

    // Step 4: Create a dashboard notification record in the database.
    // This assumes you have a `notifications` table with columns like `user_id`, `message`, `status`, and `timestamp`.
    const notificationMessage = `Your appointment at the ${officeName} is ready.`;
    const notificationSql = `INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())`;
    await db.query(notificationSql, [appointment.user_id, notificationMessage]);
    console.log(`🔔 Dashboard notification added for user ID: ${appointment.user_id}`);


    // Step 5: Send a successful response back to the client.
    res.status(200).json({ success: true, message: 'All notifications sent successfully.' });

  } catch (error) {
    console.error('❌ Failed to send notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to send notifications.', error: error.message });
  }
}

module.exports = {
  bookAppointment,
  confirmAppointment,
  getUserAppointments,
  getAvailableSlots,
  getAppointmentById,
  cancelAppointment,
  notifyStudent 
};
