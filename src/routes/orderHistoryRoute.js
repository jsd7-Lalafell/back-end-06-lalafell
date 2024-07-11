const express = require('express');
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");
const orderHistoryController = require('../controllers/orderHistoryController');
const router = express.Router();

router.post('/order-history', authenticateMiddleware, orderHistoryController.createOrder);
router.get('/orders-history', authenticateMiddleware, orderHistoryController.getOrderHistory);
router.get('/order-history/:id', authenticateMiddleware, orderHistoryController.getOrderHistoryById);

module.exports = router;
