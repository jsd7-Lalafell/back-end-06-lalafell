const User = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");

const getUser = async (req, res) => {
  try {
    const users = await User.find();

    return res.json({ error: false, users });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  const user = req.user;
  try {
    return res.json({ error: false, myUser: user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  const user = req.user;

  // ดึงข้อมูลที่ส่งมาจาก body
  const { firstName, lastName, email } = req.body;

  try {
    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    console.log(user);
    await user.save();

    // ส่งข้อมูลผู้ใช้ที่อัปเดตแล้วกลับไปยัง frontend
    return res.json({ error: false, myUser: user });
  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์: ${error.message}`);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const updateProfileImage = async (req, res) => {
  const user = req.user;

  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "users",
    });
    user.img = result.secure_url;
    await user.save();
    return res.json({ error: false, myUser: user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = { getUser, updateProfile, getProfile, updateProfileImage };
