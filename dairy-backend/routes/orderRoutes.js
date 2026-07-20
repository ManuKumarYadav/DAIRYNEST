const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { shopName, products, shopOwner, address } = req.body;

    console.log("Incoming Order:", req.body);

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array required",
      });
    }

    const cleanedProducts = products.map((item) => ({
      productName: item.productName || "Item",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      image: item.image || "",
    }));

    const newOrder = new Order({
      shopName: shopName || "DairyNest",
      products: cleanedProducts,
      shopOwner: shopOwner || "guest",
      address,
      status: "Paid",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
    });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/shop/:owner", async (req, res) => {
  try {
    const orders = await Order.find({
      shopOwner: req.params.owner,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;