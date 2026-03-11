const express = require("express");
const multer = require("multer");
const path = require("path");

const parseCsv = require("../utils/parseCsv");
const generateSummary = require("../services/aiService");
const sendEmail = require("../services/emailService");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = [".csv"];
    const ext = path.extname(file.originalname);

    if (!allowed.includes(ext)) {
      return cb(new Error("Only CSV files allowed"));
    }

    cb(null, true);
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "File upload required"
      });
    }

    if (!req.body.email) {
      return res.status(400).json({
        error: "Email required"
      });
    }

    console.log("File received:", req.file.filename);

    const data = await parseCsv(req.file.path);

    console.log("CSV parsed successfully");

    const summary = await generateSummary(data);

    console.log("AI summary generated");

    await sendEmail(req.body.email, summary);

    console.log("Email sent");

    res.json({
      message: "Summary generated and email sent successfully"
    });

  } catch (err) {

    console.error("Upload Error:", err.message);

    res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;