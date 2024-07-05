const express = require("express");
const addressController = require("../controllers/AddressController");
const { authenticateToken } = require("../utils/token");

const router = express.Router();

router.get("/adress", authenticateToken, addressController.getAllAddress);
router.post("/adress", authenticateToken, addressController.createAddress);
router.patch("/adress/:id", authenticateToken, addressController.updateAddress);
router.delete(
  "/adress/:id",
  authenticateToken,
  addressController.deleteAddress
);

module.exports = router;
