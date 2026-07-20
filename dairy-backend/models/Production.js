const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  milkUsed: Number,
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Production", productionSchema);