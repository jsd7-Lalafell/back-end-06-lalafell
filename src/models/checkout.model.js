const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        productName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    OrderDate: {
      type: Date,
      default: Date.now
    }
  });
  

const Checkout = mongoose.model("Checkout", checkoutSchema);

module.exports = Checkout;
