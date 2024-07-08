const express = require("express");
const {
  adminAuthenticateMiddleware,
} = require("../middleware/adminAuthenticateMiddleware");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/product", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.post(
  "/product",
  adminAuthenticateMiddleware,
  productController.createProduct
);
router.patch(
  "/product/:id",
  adminAuthenticateMiddleware,
  productController.updateProduct
);
router.delete(
  "/product/:id",
  adminAuthenticateMiddleware,
  productController.deleteProduct
);

module.exports = router;
