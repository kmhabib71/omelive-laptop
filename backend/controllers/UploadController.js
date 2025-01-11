const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Controller for handling file upload
exports.uploadFile = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({
    filePath: `/uploads/${file.filename}`,
    fileName: file.originalname,
  });
};

exports.uploadMiddleware = upload.single("file");
