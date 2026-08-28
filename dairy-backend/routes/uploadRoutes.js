const express = require("express");
const upload = require("../config/multer");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
