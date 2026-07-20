const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "staff", "shop"],
    default: "staff"
  },
  isDeleted: {
    type: Boolean,
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);