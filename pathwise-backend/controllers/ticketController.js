const db = require('../db');
const Ticket = require('../models/Ticket');


function createTicket(req, res) {
  const { user_id, name, office, service, additional_info, form_data, priority_lane } = req.body;

  // Check if the user already has a non-cancelled ticket for the same office
  const checkQuery = `
    SELECT * FROM tickets 
    WHERE user_id = ? 
      AND office = ? 
      AND status NOT IN ('done', 'cancelled')
  `;

  db.query(checkQuery, [user_id, office], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error during duplicate check' });

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already have a pending request in this office.' });
    }

    const autoPriorityServices = ['Request for Academic Records', 'ID Verification', 'Borrow Books'];

    // Determine final priority value
    const isPriority = !!priority_lane || autoPriorityServices.includes(service);

    // Proceed to create ticket
    Ticket.create({ user_id, name, office, service, additional_info, form_data, priority_lane: isPriority}, (err, results) => {
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

function getActiveTicketsByOffice(req, res) {
  const { office } = req.params;

  const query = `
    SELECT id, user_id, name, office, service, additional_info,
           office_ticket_no, status, window_no, created_at, form_data, priority_lane
    FROM tickets 
    WHERE office = ? 
      AND status IN ('waiting', 'called', 'in_progress')
    ORDER BY priority_lane DESC, created_at ASC
  `;

  db.query(query, [office], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const enriched = results.map(ticket => ({
      ...ticket,
      form_data: ticket.form_data ? JSON.parse(ticket.form_data) : {}
    }));

    res.json(enriched);
  });
}



function getTicketsByOffice(req, res) {
  const { office } = req.params;
  const { statusGroup } = req.query;

  const statusMap = {
    active: ['waiting', 'called', 'in_progress'],
    history: ['done', 'cancelled'],
    all: ['done', 'cancelled'], // explicitly support "all" too
    done: ['done'],
    cancelled: ['cancelled'],
  };

  // default to 'active' if unknown or missing
  const statuses = statusMap[statusGroup] || statusMap['active'];

  const query = `
    SELECT id, user_id, name, office, service, additional_info,
           office_ticket_no, status, window_no, created_at, form_data
    FROM tickets 
    WHERE office = ? 
      AND status IN (${statuses.map(() => '?').join(',')})
    ORDER BY created_at DESC
  `;

  db.query(query, [office, ...statuses], (err, results) => {
    if (err) {
      console.error('Error fetching tickets by office:', err);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    // parse JSON field
    const enriched = results.map(ticket => ({
      ...ticket,
      form_data: ticket.form_data ? JSON.parse(ticket.form_data) : {}
    }));

    res.json(enriched);
  });
}




function updateTicketStatus(req, res) {
  const { status, windowNo } = req.body;
  const ticketId = req.params.id;

  let sql, values;

  if (windowNo) {
    // Update both status and window
    sql = `
        UPDATE tickets
        SET status = ?, window_no = ?
        WHERE id = ?
      `;
      values = [status, windowNo, ticketId];

  } else {
    // Update only status
    sql = `
      UPDATE tickets
      SET status = ?
      WHERE id = ?
    `;
    values = [status, ticketId];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: 'DB error during status update' });
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

function callTicket(req, res) {
  const ticketId = req.params.id;
  const staffWindow = req.user?.windowNo; // Make sure this matches your AuthContext structure

  if (!staffWindow) {
    return res.status(400).json({ error: 'Staff window number not found in user data.' });
  }

  const updateQuery = `
    UPDATE tickets 
    SET status = 'called', called_at = NOW(), window_no = ? 
    WHERE id = ?
  `;

  db.query(updateQuery, [staffWindow, ticketId], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error while calling ticket.' });
    }

    res.json({ success: true, message: 'Ticket called and window number saved.' });
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
  cancelTicket,
  callTicket,
  getActiveTicketsByOffice
};
