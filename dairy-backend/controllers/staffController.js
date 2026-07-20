const Milk = require("../models/Milk");
const Production = require("../models/Production");
const Product = require("../models/Product");

exports.addMilk = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ msg: "Milk quantity required" });
    }

    const milk = await Milk.create({
      quantity: Number(quantity),
      date: new Date()
    });

    res.json({ msg: "Milk added successfully", milk });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMilk = async (req, res) => {
  try {
    const milk = await Milk.find().sort({ date: -1 });
    res.json(milk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addProduction = async (req, res) => {
  try {
    const { productId, quantity, milkUsed } = req.body;

    console.log("REQ BODY:", req.body);

    if (!productId || !quantity || !milkUsed) {
      return res.status(400).json({ msg: "All fields required" });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    product.stock += Number(quantity);
    await product.save();

    const production = await Production.create({
      productId,
      productName: product.name,
      quantity: Number(quantity),
      milkUsed: Number(milkUsed),
      date: new Date()
    });

    res.json({
      msg: "Production added & stock updated",
      production
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduction = async (req, res) => {
  try {
    const data = await Production.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};