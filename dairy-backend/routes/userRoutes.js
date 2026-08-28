const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const avatarUpload = require("../config/avatarMulter");

const {
  createStaff,
  getStaff,
  deleteStaff,
  getMe,
  updateProfile,
  uploadAvatar,
} = require("../controllers/userController");

router.get("/me", auth(), getMe);
router.put("/profile", auth(), updateProfile);
router.post(
  "/avatar",
  auth(),
  (req, res, next) => {
    avatarUpload.single("avatar")(req, res, (err) => {
      if (err) return res.status(400).json({ msg: err.message });
      next();
    });
  },
  uploadAvatar
);

router.post("/staff", auth(["admin"]), createStaff);
router.get("/staff", auth(["admin"]), getStaff);
router.delete("/staff/:id", auth(["admin"]), deleteStaff);

module.exports = router;
