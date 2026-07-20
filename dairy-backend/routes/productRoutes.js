const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, originalPrice, discount, stock } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      discount: Number(discount) || 0,
      stock: Number(stock) || 0,
      image: req.file ? req.file.path : ""
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;