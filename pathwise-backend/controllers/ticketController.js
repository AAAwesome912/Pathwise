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
    }));

    res.json(enriched);
  });
}

function getTicketsByOffice(req, res) {
  Ticket.getByOffice(req.params.office, (err, tickets) => {
    if (err) return res.status(500).json({ error: err });

    const enriched = tickets.map(ticket => ({
      ...ticket,
      form_data: ticket.form_data ? JSON.parse(ticket.form_data) : {}
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
    SELECT id
    FROM tickets
    WHERE office = ? AND status = 'in_progress'
    ORDER BY id ASC
    LIMIT 1
  `;

  db.query(query, [office], (err, results) => {
    if (err) {
      console.error('Error fetching now serving ticket:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Results:', results);

    if (results.length > 0) {
      res.json({ nowServingTicketNumber: results[0].id });
    } else {
      res.json({ nowServingTicketNumber: null });
    }
  });
}


module.exports = {
  createTicket,
  getTicketsByUser,
  getTicketsByOffice,
  updateTicketStatus,
  getNowServingTicket
};
