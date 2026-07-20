require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
//IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const milkRoutes = require("./routes/milkRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const productRoutes = require("./routes/productRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const staffRoutes = require("./routes/staffRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

//IMPORT MODELS
const User = require("./models/User");
const bcrypt = require("bcryptjs");

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//STATIC FILES
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("DairyNest Backend Running");
});

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/milk", milkRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", uploadRoutes);

//ADMIN AUTO CREATE
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        role: "admin",
      });

      console.log("Admin Created Sucessfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.log("Admin Error:", err.message);
  }
};

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully");

    await createAdmin();

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("DB Error:", err.message);
  });
``
