const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    village: String,
    phone: String
}, { timestamps: true });

module.exports = mongoose.model("Farmer", farmerSchema);