const mongoose = require("mongoose");

const milkSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  fatPercentage: { type: Number, default: 0 },
  source: { type: String, default: "Direct Collection" }, // village/area
  farmerName: { type: String, default: "" },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", default: null },
  vehicleNumber: { type: String, default: "" },
  notes: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Milk", milkSchema);
