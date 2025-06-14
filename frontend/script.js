const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Complaint = require('../models/Complaint'); // Adjust if path is different

const router = express.Router();

// 🔧 Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 🌥 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// 📤 POST /api/complaints — Add complaint with image
router.post('/', upload.single('image'), async (req, res) => {
  const { room, description } = req.body;

  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const complaint = new Complaint({
          room,
          description,
          imageUrl: result.secure_url
        });

        await complaint.save();
        res.json(complaint);
      }
    );

    req.file.stream.pipe(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/complaints — Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔄 PUT /api/complaints/:id — Mark as resolved
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;