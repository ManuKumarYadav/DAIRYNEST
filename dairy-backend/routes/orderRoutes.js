const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByShop,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/shop/:owner", getOrdersByShop);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
