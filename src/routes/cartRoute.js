const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");
const router = express.Router();

router.get('/cart', authenticateMiddleware, cartController.getCart);
router.patch('/cart', authenticateMiddleware, cartController.updateCart);
router.delete('/cart/:cartId', authenticateMiddleware, cartController.deleteCart);
router.put('/cart/:cartId', authenticateMiddleware, cartController.updateCartItem);

module.exports = router;
