const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addMilk,
  getMilk,
  addProduction,
  getProduction
} = require("../controllers/staffController");

router.post("/milk", auth(["staff"]), addMilk);


router.get("/milk", auth(["staff"]), getMilk);

router.post("/production", auth(["staff"]), addProduction);

router.get("/production", auth(["staff"]), getProduction);

module.exports = router;