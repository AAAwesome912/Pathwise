const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/user/:userId', ticketController.getTicketsByUser);
router.get('/office/:office', ticketController.getTicketsByOffice);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.get('/now-serving/:office', ticketController.getNowServingTicket);

module.exports = router;
