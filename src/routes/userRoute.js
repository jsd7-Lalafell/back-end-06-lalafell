const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../utils/token");

const router = express.Router();

router.get("/users", authenticateToken, userController.getUser);
router.get("/profile", authenticateToken, userController.getProfile);
router.patch("/user", authenticateToken, userController.updateUser);

module.exports = router;
