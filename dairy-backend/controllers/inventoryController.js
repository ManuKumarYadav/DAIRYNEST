const Inventory = require("../models/Inventory");
exports.addProduct = async (req, res) => {
  try {
    const { productName, price } = req.body;

    const product = await Inventory.create({
      productName,
      price,
      stock: 0
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Inventory.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ msg: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};