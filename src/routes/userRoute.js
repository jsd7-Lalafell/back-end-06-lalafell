const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../utils/token");

const router = express.Router();

router.get("/user", authenticateToken, userController.getUser);
router.patch("/user", authenticateToken, userController.updateUser);

module.exports = router;
