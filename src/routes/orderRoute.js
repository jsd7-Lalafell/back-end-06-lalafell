const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");
const router = express.Router();

router.get('/order', authenticateMiddleware, orderController.getOrder);
router.post('/order', authenticateMiddleware, orderController.createOrder);

module.exports = router;