const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');
const verifyToken = require('../middleware/verifyToken');

// PUBLIC
router.get('/availability/:office/:date', appointmentController.getAvailableSlots);

// PROTECTED
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.post('/confirm', verifyToken, appointmentController.confirmAppointment);
router.get('/user/:userId', verifyToken, appointmentController.getUserAppointments);
router.get('/users/:userId', appointmentController.getUserAppointments);
router.get('/:id', verifyToken, appointmentController.getAppointmentById);
router.put('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;