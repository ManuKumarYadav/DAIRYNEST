const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "staff",
      isDeleted: false
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: "staff",
      isDeleted: false
    });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteStaff = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    });

    res.json({ msg: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};