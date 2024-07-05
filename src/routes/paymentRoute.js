const express = require("express");
const { authenticateToken } = require("../utils/token");
const paymentController = require("../controllers/PaymentController");

const router = express.Router();

router.get("/payment", authenticateToken, paymentController.getAllPayment);
router.post("/payment", authenticateToken, paymentController.createPayment);
router.delete(
  "/payment/:paymentId",
  authenticateToken,
  paymentController.deletePayment
);

module.exports = router;
