const express = require("express");
const userController = require("../controllers/userController");
const {
  authenticateMiddleware,
} = require("../middleware/authenticateMiddleware");
const {
  adminAuthenticateMiddleware,
} = require("../middleware/adminAuthenticateMiddleware");

const router = express.Router();

router.get("/users", adminAuthenticateMiddleware, userController.getUser);
router.get("/profile", authenticateMiddleware, userController.getProfile);
router.patch("/user/:id", authenticateMiddleware, userController.updateUser);

module.exports = router;
