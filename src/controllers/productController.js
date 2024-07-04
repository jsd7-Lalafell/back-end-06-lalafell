const Product = require("../models/product.model");

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
  const { name, price, description, type, spec, img } = req.body;
  const { user } = req.user;
  if (!name || !price || !description || !img || !type || !spec) {
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
      type,
      spec,
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
};

const updateProduct = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
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
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
