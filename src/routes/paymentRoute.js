const express = require("express");
const {
  authenticateMiddleware,
} = require("../middleware/authenticateMiddleware");
const paymentController = require("../controllers/PaymentController");

const router = express.Router();

router.get("/payment", authenticateMiddleware, paymentController.getAllPayment);
router.post(
  "/payment",
  authenticateMiddleware,
  paymentController.createPayment
);
router.delete(
  "/payment/:paymentId",
  authenticateMiddleware,
  paymentController.deletePayment
);

module.exports = router;
