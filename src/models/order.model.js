const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderItems: [
    {
      product: {
        type: String,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

  user: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  payment: {
    type: String,
    required: true,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
