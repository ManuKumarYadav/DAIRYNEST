const Order = require("../models/Order");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { shopName, products, shopOwner, address } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required",
      });
    }

    const cleanedProducts = products.map((item) => ({
      productName: item.productName || item.name || "Item",
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
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get orders by shop owner
exports.getOrdersByShop = async (req, res) => {
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
};

// Update order status
exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
