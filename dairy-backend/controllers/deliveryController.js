const Delivery = require("../models/Delivery");
const Order = require("../models/Order");

exports.createDelivery = async (req, res) => {
    try {
        const { orderId, deliveryPerson } = req.body;

        const delivery = await Delivery.create({
            order: orderId,
            deliveryPerson,
            status: "out_for_delivery"
        });

        await Order.findByIdAndUpdate(orderId, {
            status: "approved"
        });
        res.json(delivery);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDeliveries = async (req, res) => {
    try {
        const data = await Delivery.find().populate("order");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markDelivered = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            {
                status: "delivered",
                deliveryDate: new Date()
            },
            { new: true }
        );

        res.json(delivery);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.markDelivered = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ msg: "Delivery not found" });
        }

        delivery.status = "delivered";
        delivery.deliveryDate = new Date();

        await delivery.save();

        res.json(delivery);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};