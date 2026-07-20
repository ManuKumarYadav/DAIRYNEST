const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  addFarmer,
  getFarmers,
  deleteFarmer 
} = require("../controllers/farmerController");

router.post("/", auth(["admin"]), addFarmer);
router.get("/", auth(["admin"]), getFarmers);
router.delete("/:id", auth(["admin"]), deleteFarmer);

module.exports = router;