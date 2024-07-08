const express = require("express");
const {
  authenticateMiddleware,
} = require("../middleware/authenticateMiddleware");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/product", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.post(
  "/product",
  authenticateMiddleware,
  productController.createProduct
);
router.patch(
  "/product/:id",
  authenticateMiddleware,
  productController.updateProduct
);
router.delete(
  "/product/:id",
  authenticateMiddleware,
  productController.deleteProduct
);

module.exports = router;
