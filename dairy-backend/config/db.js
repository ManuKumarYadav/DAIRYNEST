const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Staff = require("../models/Staff");
const Product = require("../models/Product");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@gmail.com",
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10),
        role: "admin",
      });

      console.log("Default Admin created successfully");
    } else {
      console.log("Admin account exists");
    }
  } catch (err) {
    console.error("Admin initialization error:", err.message);
  }
};

const seedDefaultProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const defaultProducts = [
        {
          name: "DairyNest Gold Full Cream Milk (500ml)",
          price: 34,
          originalPrice: 38,
          discount: 11,
          stock: 120,
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Taaza Toned Fresh Milk (1L)",
          price: 56,
          originalPrice: 62,
          discount: 10,
          stock: 150,
          image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Pure Desi Cow Ghee (1L)",
          price: 599,
          originalPrice: 699,
          discount: 14,
          stock: 80,
          image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Fresh Malai Paneer (200g)",
          price: 95,
          originalPrice: 110,
          discount: 14,
          stock: 95,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Creamy Table Butter (100g)",
          price: 56,
          originalPrice: 60,
          discount: 7,
          stock: 110,
          image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Thick Probiotic Dahi (400g)",
          price: 35,
          originalPrice: 40,
          discount: 12,
          stock: 75,
          image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Alphonso Mango Lassi (200ml)",
          price: 30,
          originalPrice: 35,
          discount: 14,
          stock: 100,
          image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "DairyNest Mawa Gulab Jamun (500g)",
          price: 220,
          originalPrice: 260,
          discount: 15,
          stock: 50,
          image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
        },
      ];

      await Product.insertMany(defaultProducts);
      console.log("✅ Seeded default DairyNest products into database successfully");
    } else {
      console.log(`Database already has ${count} products.`);
    }
  } catch (err) {
    console.error("Product seeding error:", err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await Staff.syncIndexes();
    await createAdmin();
    await seedDefaultProducts();
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
