const express = require("express");
const addressController = require("../controllers/AddressController");
const {
  authenticateMiddleware,
} = require("../middleware/authenticateMiddleware");

const router = express.Router();

router.get("/address", authenticateMiddleware, addressController.getAllAddress);
router.post(
  "/address",
  authenticateMiddleware,
  addressController.createAddress
);
router.patch(
  "/address/:id",
  authenticateMiddleware,
  addressController.updateAddress
);
router.delete(
  "/address/:id",
  authenticateMiddleware,
  addressController.deleteAddress
);

module.exports = router;
