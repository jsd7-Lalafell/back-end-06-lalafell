const Product = require("../models/product.model");
const cloudinary = require("../utils/cloudinary");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({ error: false, products });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return res.json({ error: false, product });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, type } = req.body;
  const user = req.user;

  if (!name || !price || !description || !type) {
    return res.status(400).json({
      error: true,
      message: "Please provide all required fields",
    });
  } else {
    console.log(req.body);
  }

  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: "No file uploaded",
    });
  } else {
    console.log(req.file);
  }

  const file = req.file; // ไฟล์ที่อัปโหลดจาก Multer จะอยู่ใน req.file
  if (!file) {
    return res.status(400).json({
      error: true,
      message: "No file uploaded",
    });
  }

  console.log(user);

  try {
    // ดำเนินการอัปโหลดไฟล์ไปยัง Cloudinary หรือทำอย่างอื่นตามที่ต้องการ
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "products",
    });
    const product = new Product({
      name,
      price,
      description,
      img: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      type,
      addBy: user.name,
    });

    await product.save();

    return res.json({
      error: false,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  const { name, price, description, img } = req.body;
  const user = req.user;
  const id = req.params.productId;

  if (!name && !price && !description && !img) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const product = await Product.findOne({ _id: id, addBy: user.id });
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
};

const deleteProduct = async (req, res) => {
  const user = req.user;
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ _id: productId, addBy: user.id });
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    await Product.deleteOne({ _id: productId });

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
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
