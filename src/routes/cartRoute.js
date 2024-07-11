const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");
const router = express.Router();

router.get('/cart', authenticateMiddleware, cartController.getCart);
router.post('/cart', authenticateMiddleware, cartController.createCart);
router.patch('/cart/:cartId', authenticateMiddleware, cartController.updateCart);
router.delete('/cart/:cartId', authenticateMiddleware, cartController.deleteCart);

module.exports = router;
