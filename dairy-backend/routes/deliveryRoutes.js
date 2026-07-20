const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
    createDelivery,
    getDeliveries,
    markDelivered
} = require("../controllers/deliveryController");

router.post("/", auth(["admin"]), createDelivery);

router.get("/", auth(["admin", "staff"]), getDeliveries);

router.put("/:id", auth(["admin"]), markDelivered);

module.exports = router;