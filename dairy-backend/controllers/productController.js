const Product = require("../models/Product");
exports.addProduct = async (req, res) => {
  try {
    let { name, price, originalPrice, discount } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    price = Number(price);
    originalPrice = Number(originalPrice);
    discount = Number(discount);

    if (!name || !price) {
      return res.status(400).json({ msg: "Name & Price required ❌" });
    }

    const exists = await Product.findOne({ name: name.toLowerCase() });

    if (exists) {
      return res.status(400).json({ msg: "Product already exists ❌" });
    }

    const product = await Product.create({
      name: name.toLowerCase(),
      price,
      originalPrice,
      discount,
      image,
      stock: 0
    });

    res.json(product);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};