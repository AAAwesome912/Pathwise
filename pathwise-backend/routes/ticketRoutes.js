const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyToken = require('../middleware/verifyToken');

// Routes below require a valid token
router.post('/', verifyToken, ticketController.createTicket);
router.get('/user/:userId', verifyToken, ticketController.getTicketsByUser);
router.get('/office/:office', verifyToken, ticketController.getTicketsByOffice);
router.patch('/:id/status', verifyToken, ticketController.updateTicketStatus);
router.get('/now-serving/:office', verifyToken, ticketController.getNowServingTicket);
router.get('/office/:office/waiting-count', verifyToken, ticketController.getWaitingCount);
router.patch('/:id/serve', verifyToken, ticketController.serveTicket);
router.post('/reset-office-ticket', verifyToken, ticketController.resetOfficeTicketNumbers);
router.put('/cancel/:office/:officeTicketNo', verifyToken, ticketController.cancelTicket);
router.get('/active/:office', verifyToken, ticketController.getActiveTicketsByOffice);

module.exports = router;
