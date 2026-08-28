const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addMilk,
  getMilk,
  useMilk,
  getMilkSummary,
  getFarmers,
  addProduction,
  getProduction,
} = require("../controllers/staffController");

router.post("/milk", auth(["staff"]), addMilk);
router.get("/milk", auth(["staff"]), getMilk);

router.post("/milk/use", auth(["staff"]), useMilk);
router.get("/milk/summary", auth(["staff"]), getMilkSummary);

router.get("/farmers", auth(["staff"]), getFarmers);

router.post("/production", auth(["staff"]), addProduction);
router.get("/production", auth(["staff"]), getProduction);

module.exports = router;
