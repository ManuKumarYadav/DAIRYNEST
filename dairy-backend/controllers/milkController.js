const Milk = require("../models/Milk");

exports.addMilk = async (req, res) => {
    try {
        const { farmer, quantity, fat } = req.body;

        if (!farmer || !quantity || !fat) {
            return res.status(400).json({ msg: "All fields required" });
        }

        const milk = await Milk.create({ farmer, quantity, fat });

        res.json(milk);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMilk = async (req, res) => {
    try {
        const data = await Milk.find().populate("farmer");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};