const express = require("express");
const upload = require("../config/multer");

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;