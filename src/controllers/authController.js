const { hashPassword, comparePassword } = require("../utils/hash");
const User = require("../models/user.model");
const { sign } = require("../utils/token");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res) => {
  const { firstName, lastName, email, password, img } = req.body;
  console.log(req.body);
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  const file = req.file;
  if (img && !file) {
    return res.status(400).json({ error: true, message: "No file uploaded" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "users",
    });

    const user = new User({
      name: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      img: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await user.save();

    const accessToken = sign({ user });

    return res.status(201).json({
      error: false,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        img: user.img,
      },
      accessToken,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(`Error during registration: ${error.message}`);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่ามีการป้อน email และ password
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials" });
    }

    // Generate token
    const accessToken = sign({ user: user._id });

    // ลบข้อมูลที่ไม่ต้องการ
    const { password: userPassword, ...userData } = user.toObject();

    res
      .status(200)
      .json({ message: "Login success", data: userData, accessToken });
  } catch (error) {
    // จัดการข้อผิดพลาดที่ไม่คาดคิด
    return res.status(500).json({
      error: true,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

module.exports = { register, login };
