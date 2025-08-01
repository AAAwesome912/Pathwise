const db = require('../db');
const Ticket = require('../models/Ticket');


function createTicket(req, res) {
  const { user_id, name, office, service, additional_info, form_data } = req.body;

  // Check if the user already has a ticket for the same service and not done
  const checkQuery = `
    SELECT * FROM tickets 
    WHERE user_id = ? AND service = ? AND status != 'done'
  `;

  db.query(checkQuery, [user_id, service], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error during duplicate check' });

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already have a pending request for this service.' });
    }

    // Proceed to create ticket
    Ticket.create({ user_id, name, office, service, additional_info, form_data }, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const ticketId = results.insertId;
      
      res.status(201).json({ success: true, ticketId });
    });
  });
}


function getTicketsByUser(req, res) {
  Ticket.getByUserId(req.params.userId, (err, tickets) => {
    if (err) return res.status(500).json({ error: err });

    const enriched = tickets.map(ticket => ({
      ...ticket,
      form_data: ticket.form_data ? JSON.parse(ticket.form_data) : {},
      office_ticket_no: ticket.office_ticket_no  // <- make sure this is here
    }));

    res.json(enriched);
  });
}


function getTicketsByOffice(req, res) {
  Ticket.getByOffice(req.params.office, (err, tickets) => {
    if (err) return res.status(500).json({ error: err });

    const enriched = tickets.map(ticket => ({
      ...ticket,
      form_data: ticket.form_data ? JSON.parse(ticket.form_data) : {},
      office_ticket_no: ticket.office_ticket_no
    }));

    res.json(enriched);
  });
}

function updateTicketStatus(req, res) {
  Ticket.updateStatus(req.params.id, req.body.status, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
}

function getNowServingTicket(req, res) {
  const { office } = req.params;
  console.log('Fetching now serving for:', office);

  const query = `
    SELECT office_ticket_no
    FROM tickets
    WHERE office = ? AND status = 'in_progress'
    ORDER BY created_at ASC
    LIMIT 1
  `;

  db.query(query, [office], (err, results) => {
    if (err) {
      console.error('Error fetching now serving ticket:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Results:', results);

    if (results.length > 0) {
      res.json({ nowServingTicketNumber: results[0].office_ticket_no });
    } else {
      res.json({ nowServingTicketNumber: null });
    }
  });
}


function getWaitingCount(req, res) {
  const { office } = req.params;
  Ticket.countWaitingByOffice(office, (err, count) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ waitingCount: count });
  });
}

function serveTicket(req, res) {
  const { id } = req.params;
  const { windowNo } = req.body;  // only windowNo is needed

  const sql = `
    UPDATE tickets
    SET status = 'in_progress',
        form_data = JSON_SET(form_data, '$.window', ?)
    WHERE id = ?
  `;

  db.query(sql, [windowNo, id], (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
}

function resetOfficeTicketNumbers(req, res) {
  const { office } = req.body;

  if (!office) {
    return res.status(400).json({ error: 'Office is required' });
  }

  Ticket.resetOfficeTicketNo(office, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to reset ticket numbers' });

    res.json({ success: true, message: `Ticket numbers reset for office: ${office}` });
  });
}


  function cancelTicket(req, res) {
  const { office, officeTicketNo } = req.params;

  const query = `
    UPDATE tickets
    SET status = 'cancelled'
    WHERE office = ? AND office_ticket_no = ? AND status NOT IN ('done', 'cancelled')
  `;

  db.query(query, [office, officeTicketNo], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to cancel ticket' });

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Ticket not found or already completed' });
    }

    res.json({ success: true, message: 'Ticket cancelled successfully' });
  });
}





module.exports = {
  createTicket,
  getTicketsByUser,
  getTicketsByOffice,
  updateTicketStatus,
  getNowServingTicket,
  getWaitingCount,
  serveTicket,
  resetOfficeTicketNumbers,
  cancelTicket
};
