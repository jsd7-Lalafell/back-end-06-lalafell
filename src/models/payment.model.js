const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  number1: { type: Number, required: true },
  number2: { type: Number, required: true },
  number3: { type: Number, required: true },
  number4: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);
