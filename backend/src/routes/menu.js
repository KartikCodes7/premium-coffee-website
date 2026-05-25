const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getMenuItems);
router.post('/', menuController.addMenuItem);
router.patch('/:id/price', menuController.updateMenuPrice);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
