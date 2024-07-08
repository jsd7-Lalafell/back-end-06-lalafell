const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  tel: { type: String, required: true },
  address: { type: String, required: true },
  subDistrict: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  zipCode: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Address", addressSchema);
