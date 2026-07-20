const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {createStaff,getStaff,deleteStaff} = require("../controllers/userController");

router.post("/staff", auth(["admin"]), createStaff);
router.get("/staff", auth(["admin"]), getStaff);
router.delete("/staff/:id", auth(["admin"]), deleteStaff);

module.exports = router;