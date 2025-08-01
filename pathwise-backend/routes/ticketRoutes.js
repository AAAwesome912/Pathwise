const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/user/:userId', ticketController.getTicketsByUser);
router.get('/office/:office', ticketController.getTicketsByOffice);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.get('/now-serving/:office', ticketController.getNowServingTicket);
router.get('/office/:office/waiting-count', ticketController.getWaitingCount);
router.patch('/:id/serve', ticketController.serveTicket);
router.post('/reset-office-ticket', ticketController.resetOfficeTicketNumbers);
router.put('/cancel/:office/:officeTicketNo', ticketController.cancelTicket);


module.exports = router;
