const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  price: { type: Number, required: true },

  originalPrice: { type: Number, default: 0 },

  discount: { type: Number, default: 0 },

  stock: { type: Number, default: 0 },

  image: { type: String, default: "" }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);