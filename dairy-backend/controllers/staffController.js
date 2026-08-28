const Milk = require("../models/Milk");
const Production = require("../models/Production");
const Product = require("../models/Product");
const Farmer = require("../models/Farmer");

exports.addMilk = async (req, res) => {
  try {
    const {
      quantity,
      farmerName,
      farmerId,
      source,
      fatPercentage,
      vehicleNumber,
      notes,
    } = req.body;

    if (!quantity) {
      return res.status(400).json({ msg: "Milk quantity is required" });
    }

    const milkData = {
      quantity: Number(quantity),
      farmerName: farmerName || "",
      source: source || "Direct Collection",
      fatPercentage: fatPercentage ? Number(fatPercentage) : 0,
      vehicleNumber: vehicleNumber || "",
      notes: notes || "",
      date: new Date(),
    };

    if (farmerId) {
      milkData.farmerId = farmerId;
    }

    const milk = await Milk.create(milkData);
    res.json({ msg: "Milk intake recorded successfully", milk });
  } catch (err) {
    console.error("addMilk error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMilk = async (req, res) => {
  try {
    const milk = await Milk.find().sort({ date: -1 }).limit(50);
    res.json(milk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.useMilk = async (req, res) => {
  try {
    const { quantity, purpose, notes } = req.body;
    if (!quantity || !purpose) {
      return res.status(400).json({ msg: "Quantity and purpose required" });
    }
    const entry = await Milk.create({
      quantity: -Number(quantity),
      farmerName: "Internal Use",
      source: purpose,
      notes: notes || "",
      date: new Date(),
    });
    res.json({ msg: "Milk usage recorded", entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMilkSummary = async (req, res) => {
  try {
    const all = await Milk.find();
    const totalIn = all
      .filter((m) => m.quantity > 0)
      .reduce((s, m) => s + m.quantity, 0);
    const totalUsed = all
      .filter((m) => m.quantity < 0)
      .reduce((s, m) => s + Math.abs(m.quantity), 0);
    const balance = totalIn - totalUsed;
    res.json({ totalIn, totalUsed, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduction = async (req, res) => {
  try {
    const { productId, quantity, milkUsed } = req.body;

    if (!productId || !quantity || !milkUsed) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.stock = (product.stock || 0) + Number(quantity);
    await product.save();

    const production = await Production.create({
      productId,
      productName: product.name,
      quantity: Number(quantity),
      milkUsed: Number(milkUsed),
      date: new Date(),
    });

    res.json({ msg: "Production added & stock updated", production });
  } catch (err) {
    console.error("addProduction error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProduction = async (req, res) => {
  try {
    const data = await Production.find().sort({ date: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
