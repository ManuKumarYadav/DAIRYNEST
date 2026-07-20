const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    deliveryDate: Date,
    status: {
        type: String,
        enum: ["pending", "out_for_delivery", "delivered"],
        default: "pending"
    }
});

module.exports = mongoose.model("Delivery", deliverySchema);