const express = require("express");
const authController = require("../controllers/authController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/register", upload.single("img"), authController.register);
router.post("/login", authController.login);

module.exports = router;
