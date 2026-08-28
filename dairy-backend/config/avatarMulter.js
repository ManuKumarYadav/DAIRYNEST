const fs = require("fs");
const path = require("path");
const multer = require("multer");

const avatarDir = path.join(__dirname, "..", "uploads", "avatars");
fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${String(req.user?.id || "user").replace(/[^a-zA-Z0-9]/g, "").slice(0, 24)}-${Date.now()}${ext}`);
  },
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a JPG, PNG, WEBP, or GIF image"));
    }
  },
});

module.exports = uploadAvatar;
