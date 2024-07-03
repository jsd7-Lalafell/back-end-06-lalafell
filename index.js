require("dotenv").config();
const { hashPassword, comparePassword } = require("./utils/hash");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("connected to mongo✅");
});

const User = require("./models/user.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");
const Payment = require("./models/payment.model");
const Address = require("./models/address.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils/token");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//API line
app.get("/", (req, res) => {
  res.json({ data: "respond received from the server!" });
});

//User Authenticate----------------
//Register
app.post("/register", async (req, res) => {
  const { name, lastName, email, password, img } = req.body;

  if (!name || !lastName || !email || !password) {
    return res.json({ error: true, message: "Please provide all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    lastName,
    email,
    password: hashedPassword,
    img: img || "",
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
});
//Login
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.json({ error: true, message: "Please provide all fields" });
//   }

//   const userInfo = await User.findOne({ email });
//   if (!userInfo) {
//     return res.json({ error: true, message: "User does not exist" });
//   }

//   const match = await comparePassword(password, userInfo.password);
//   if (userInfo.email === email && match === password) {
//     const user = { user: userInfo };
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: "36000m",
//     });

//     return res.json({
//       error: false,
//       message: "Login Successful",
//       email,
//       accessToken,
//     });
//   } else {
//     return res.status(400).json({
//       error: true,
//       message: "Invalid Credentials",
//     });
//   }
// });
app.post("/login", async (req, res) => {
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
});

//User---------------
//Get user
app.get("/user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  return res.json({ error: false, user });
});
//Update user
app.patch("/user", authenticateToken, async (req, res) => {
  const { name, lastName, email, img } = req.body;
  const { user } = req.user;

  if (!name && !lastName && !email) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const user = await User.findOne({ userId: user._id });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    if (name) {
      user.name = name;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }
    if (img) {
      user.img = img;
    }
    await user.save();
    return res.json({ error: false, user });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Address---------------
//Get address
app.get("/adress", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const address = await Address.find({ userId: user._id });
    return res.json({ error: false, address });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Add address
app.post("/adress", authenticateToken, async (req, res) => {
  const {
    name,
    lastName,
    tel,
    address,
    subDistrict,
    district,
    province,
    zipCode,
  } = req.body;
  const { user } = req.user;

  if (!name || !lastName || !tel || !address || !subDistrict || !district) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    const address = new Address({
      name,
      lastName,
      tel,
      address,
      subDistrict,
      district,
      province,
      zipCode,
      userId: user._id,
    });

    await address.save();
    return res.json({
      error: false,
      address,
      message: "Address created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Edit address
app.patch("/address/:id", authenticateToken, async (req, res) => {
  const addressId = req.params.addressId;
  const {
    name,
    lastName,
    tel,
    address,
    subDistrict,
    district,
    province,
    zipCode,
  } = req.body;
  const { user } = req.user;

  if (
    !name &&
    !lastName &&
    !tel &&
    !address &&
    !subDistrict &&
    !district &&
    !province &&
    !zipCode
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const address = await Address.findOne({
      _id: addressId,
      userId: user._id,
    });

    if (!address) {
      return res
        .status(404)
        .json({ error: true, message: "Address not found" });
    }

    address.name = name || address.name;
    address.lastName = lastName || address.lastName;
    address.tel = tel || address.tel;
    address.address = address || address.address;
    address.subDistrict = subDistrict || address.subDistrict;
    address.district = district || address.district;
    address.province = province || address.province;
    address.zipCode = zipCode || address.zipCode;

    await address.save();
    return res.json({ error: false, message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Delete address
app.delete("/adress/:id", authenticateToken, async (req, res) => {
  const addressId = req.params.addressId;
  const { user } = req.user;

  try {
    const address = await Address.findOne();

    if (!address) {
      return res
        .status(404)
        .json({ error: true, message: "Address not found" });
    }

    await Address.deleteOne({ _id: addressId, userId: user._id });

    return res.json({
      error: false,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Payment--------------------
//Get payment
app.get("/payment", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const payment = await Payment.find({ userId: user._id });
    return res.json({ error: false, payment });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Add payment
app.post("/payment", authenticateToken, async (req, res) => {
  const { number1, number2, number3, number4 } = req.body;
  const { user } = req.user;

  if (!number1 || !number2 || !number3 || !number4) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    const payment = new Payment({
      number1,
      number2,
      number3,
      number4,
      userId: user._id,
    });

    await payment.save();

    return res.json({
      error: false,
      payment,
      message: "Payment created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Delete payment
app.delete("/payment/:id", authenticateToken, async (req, res) => {
  const paymentId = req.params.paymentId;
  const { user } = req.user;

  try {
    const payment = await Payment.findOne();

    if (!payment) {
      return res
        .status(404)
        .json({ error: true, message: "Payment not found" });
    }

    await Payment.deleteOne({ _id: paymentId, userId: user._id });

    return res.json({
      error: false,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Product--------------------
//Get Products
app.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({ error: false, products });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Get Product by id
app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return res.json({ error: false, product });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});
//Add Product For Admin
app.post("/product", authenticateToken, async (req, res) => {
  const { name, price, description, img } = req.body;
  const { user } = req.user;
  if (!name || !price || !description || !img) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      img: img,
      addBy: user._id,
    });

    await product.save();

    return res.json({
      error: false,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//Update Product For Admin
app.patch("/product/:id", authenticateToken, async (req, res) => {
  const { name, price, description, img } = req.body;
  const { user } = req.user;
  const { id } = req.params;

  if (!name && !price && !description && !img) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const product = await Product.findOne({ _id: id, addBy: user._id });
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }
    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (description) {
      product.description = description;
    }
    if (img) {
      product.img = img;
    }

    await product.save();

    return res.json({
      error: false,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});
//Delete Product For Admin
app.delete("/product/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { productId } = req.params.productId;

  try {
    const product = await Product.findOne({ _id: productId, addBy: user._id });
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    await Product.deleteOne({ _id: productId, addBy: user._id });

    return res.json({
      error: false,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}✅`);
});
