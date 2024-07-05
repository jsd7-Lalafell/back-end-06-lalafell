const Payment = require("../models/payment.model");

const getAllPayment = async (req, res) => {
  const { user } = req.user;
  try {
    const payment = await Payment.find({ userId: user._id });
    return res.json({ error: false, payment });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const createPayment = async (req, res) => {
  const { number1, number2, number3, number4 } = req.body;
  const { user } = req.user;

  if (!number1 || !number2 || !number3 || !number4) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    const payment = new Payment({
      number1,
      number2,
      number3,
      number4,
      userId: user._id,
    });

    await payment.save();

    return res.json({
      error: false,
      payment,
      message: "Payment created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const deletePayment = async (req, res) => {
  const paymentId = req.params.paymentId;
  const { user } = req.user;

  try {
    const payment = await Payment.findOne();

    if (!payment) {
      return res
        .status(404)
        .json({ error: true, message: "Payment not found" });
    }

    await Payment.deleteOne({ _id: paymentId, userId: user._id });

    return res.json({
      error: false,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllPayment,
  createPayment,
  deletePayment,
};
