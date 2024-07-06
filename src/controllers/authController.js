const { hashPassword, comparePassword } = require("../utils/hash");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res) => {
  const { name, lastName, email, password, img } = req.body;

  if (!name || !lastName || !email || !password) {
    return res.json({ error: true, message: "Please provide all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);
  try {
    const result = await cloudinary.uploader.upload(img, {
      folder: "users",
    });
    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      img:
        {
          public_id: result.public_id,
          url: result.secure_url,
        } || "",
    });
    await user.save();

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "36000m",
      }
    );

    return res.json({
      error: false,
      user,
      accessToken,
      message: "User created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  // ตรวจสอบว่ามีการป้อน email และ password
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const userInfo = await User.findOne({ email });

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!userInfo) {
      return res
        .status(404)
        .json({ error: true, message: "User does not exist" });
    }

    // ตรวจสอบรหัสผ่าน
    const match = await comparePassword(password, userInfo.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid Credentials" });
    }

    // สร้าง accessToken
    const user = { id: userInfo._id, email: userInfo.email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h", // ควรตั้งเวลาให้น้อยลงเพื่อความปลอดภัย
    });

    const check = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(`login :`);
    console.log(check);

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } catch (error) {
    // จัดการข้อผิดพลาดที่ไม่คาดคิด
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = { register, login };
