const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getReservations);
router.post('/', reservationController.createReservation);
router.patch('/:id/confirm', reservationController.confirmReservation);
router.patch('/:id/cancel', reservationController.cancelReservation);

module.exports = router;
