const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, discount, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Product name and price are required" });
    }

    const image = req.file ? (req.file.path || `/uploads/${req.file.filename}`) : "";

    const product = new Product({
      name: name.trim(),
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      discount: Number(discount) || 0,
      stock: Number(stock) || 0,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
