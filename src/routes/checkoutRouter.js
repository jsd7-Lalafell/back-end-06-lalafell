const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");

// GET request to retrieve checkout details
router.get("/checkout", authenticateMiddleware, checkoutController.getCheckout);

// POST request to create a new checkout
router.post("/checkout", authenticateMiddleware, checkoutController.createCheckout);

module.exports = router;



