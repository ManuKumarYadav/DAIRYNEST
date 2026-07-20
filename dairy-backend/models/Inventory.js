const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);