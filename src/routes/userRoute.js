const express = require("express");
const userController = require("../controllers/userController");
const {
  authenticateMiddleware,
} = require("../middleware/authenticateMiddleware");
const {
  adminAuthenticateMiddleware,
} = require("../middleware/adminAuthenticateMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/users", adminAuthenticateMiddleware, userController.getUser);
router.get("/profile", authenticateMiddleware, userController.getProfile);
router.patch("/profile", authenticateMiddleware, userController.updateProfile);
router.put(
  "/profile/image",
  authenticateMiddleware,
  upload.single("img"),
  userController.updateProfileImage
);
module.exports = router;
