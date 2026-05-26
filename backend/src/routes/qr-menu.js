const express = require('express');
const router = express.Router();
const qrMenuController = require('../controllers/qrMenuController');

router.get('/', qrMenuController.getQrMenu);

module.exports = router;

