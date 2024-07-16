const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");
const router = express.Router();

router.get('/cart', authenticateMiddleware, cartController.getCart);
router.patch('/cart', authenticateMiddleware, cartController.updateCart2);
router.delete('/cart/:cartId', authenticateMiddleware, cartController.deleteCart);

module.exports = router;
