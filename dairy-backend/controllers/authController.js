const User = require("../models/User");
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (role === "admin") {
      return res.status(403).json({
        msg: "Admin cannot register. Contact system owner.",
      });
    }

    if (role === "staff") {
      return res.status(403).json({
        msg: "Staff accounts are created by Admin only. Please contact your Admin for your login credentials.",
      });
    }

    const allowedRoles = ["shop"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role selected" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      msg: "User registered successfully",
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await Staff.findOne({ userId: email });
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role === "admin") {
      console.log("Admin login attempt");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
        email: user.email || user.userId || "",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      msg: "Login successful",
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
