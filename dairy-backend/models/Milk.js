const mongoose = require("mongoose");

const milkSchema = new mongoose.Schema({
  quantity: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Milk", milkSchema);