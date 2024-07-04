const express = require("express");
const { authenticateToken } = require("../utils/token");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/product", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.post("/product", authenticateToken, productController.createProduct);
router.patch(
  "/product/:id",
  authenticateToken,
  productController.updateProduct
);
router.delete(
  "/product/:id",
  authenticateToken,
  productController.deleteProduct
);

module.exports = router;
