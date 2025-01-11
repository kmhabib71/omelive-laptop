const express = require("express");
const { uploadFile, uploadMiddleware } = require("../controllers/UploadController");

const router = express.Router();

// POST /upload - File upload route
router.post("/", uploadMiddleware, uploadFile);

module.exports = router;
