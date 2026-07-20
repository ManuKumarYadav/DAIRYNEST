const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const { addMilk, getMilk } = require("../controllers/milkController");

router.post("/", auth(["admin", "staff"]), addMilk);

router.get("/", auth(), getMilk);

module.exports = router;