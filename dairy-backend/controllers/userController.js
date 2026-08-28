const User = require("../models/User");
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createStaff = async (req, res) => {
  try {
    const { name, userId, password } = req.body;

    if (!name?.trim() || !userId?.trim() || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const trimmedUserId = userId.trim();
    const exists = await Staff.findOne({
      userId: { $regex: new RegExp(`^${trimmedUserId}$`, "i") },
    });
    if (exists) {
      return res.status(400).json({ msg: `User ID "${trimmedUserId}" already exists. Please choose a different User ID.` });
    }

    const hash = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name: name.trim(),
      userId: trimmedUserId,
      password: hash,
      role: "staff",
      isDeleted: false,
    });

    res.status(201).json(staff);
  } catch (err) {
    console.error("createStaff error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({
      isDeleted: false,
    });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);

    res.json({ msg: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toPublicUser = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.password;
  return obj;
};

const normalizeId = (raw) => {
  if (raw == null || raw === "") return null;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    return trimmed && trimmed !== "[object Object]" ? trimmed : null;
  }
  if (typeof raw === "object") {
    if (typeof raw.$oid === "string") return raw.$oid;
    if (typeof raw.toHexString === "function") return raw.toHexString();
    const bytes = raw.buffer?.data || raw.data;
    if (Array.isArray(bytes)) {
      try {
        return Buffer.from(bytes).toString("hex");
      } catch (_) {}
    }
    try {
      const asString = raw.toString();
      if (asString && asString !== "[object Object]") return asString;
    } catch (_) {}
  }
  return null;
};

const findAccount = async (req) => {
  const tokenId = normalizeId(req.user?.id) || normalizeId(req.user?._id);
  if (tokenId && mongoose.isValidObjectId(tokenId)) {
    const byId = (await User.findById(tokenId)) || (await Staff.findById(tokenId));
    if (byId) return byId;
  }

  const email = String(
    req.user?.email || req.body?.email || req.query?.email || ""
  ).trim();
  if (email) {
    const byEmail =
      (await User.findOne({ email })) ||
      (await Staff.findOne({ userId: email }));
    if (byEmail) return byEmail;
  }

  const localId = normalizeId(req.body?.userId);
  if (localId && mongoose.isValidObjectId(localId)) {
    const byLocal = (await User.findById(localId)) || (await Staff.findById(localId));
    if (byLocal) return byLocal;
  }

  return null;
};

exports.getMe = async (req, res) => {
  try {
    const account = await findAccount(req);
    if (!account) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(toPublicUser(account));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const account = await findAccount(req);
    if (!account) {
      return res.status(404).json({ msg: "User not found. Please sign out and sign in again." });
    }

    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    const phone = (req.body.phone || "").trim();
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ msg: "Enter a valid 10-digit phone number" });
    }

    account.name = name;
    if (account.schema.path("phone")) account.phone = phone;
    if (account.schema.path("address")) {
      account.address = (req.body.address || "").trim();
      account.city = (req.body.city || "").trim();
      account.pincode = (req.body.pincode || "").trim();
    }

    await account.save();
    res.json({ msg: "Profile updated", user: toPublicUser(account) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Please choose a profile picture" });
    }

    const account = await findAccount(req);
    if (!account) {
      return res.status(404).json({ msg: "User not found. Please sign out and sign in again." });
    }

    account.avatar = `/uploads/avatars/${req.file.filename}`;
    await account.save();

    res.json({ msg: "Profile picture updated", user: toPublicUser(account) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
