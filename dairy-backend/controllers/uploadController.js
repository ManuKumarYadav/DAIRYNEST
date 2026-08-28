exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path || `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
