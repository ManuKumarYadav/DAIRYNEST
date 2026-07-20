const Farmer = require("../models/Farmer");

exports.addFarmer = async (req, res) => {
    try {
        const farmer = await Farmer.create(req.body);
        res.status(201).json(farmer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteFarmer = async (req, res) => {
  try {
 await Farmer.findByIdAndDelete(req.params.id);

    res.json({ msg: "Farmer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.json(farmers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};