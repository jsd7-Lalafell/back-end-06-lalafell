const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: String, required: true },
  products: { type: Array, required: true },
  total: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("Order", orderSchema);
