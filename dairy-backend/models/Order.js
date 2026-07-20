const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },

    products: [
      {
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Delivered", "Cancelled"],
      default: "Paid",
    },

    shopOwner: {
      type: String,
      default: "guest",
    },

    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      pincode: String,
    },
  },
  { timestamps: true }
);
orderSchema.pre("save", function () {
  if (this.products && this.products.length > 0) {
    this.totalPrice = this.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
});

module.exports =
mongoose.models.Order || mongoose.model("Order", orderSchema);