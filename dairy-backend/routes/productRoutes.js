const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  getProducts,
  addProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
