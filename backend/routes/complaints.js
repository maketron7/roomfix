const express = require('express');
const multer = require('multer');
const Complaint = require('../models/Complaint');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

router.post('/', upload.single('image'), async (req, res) => {
  const { room, description } = req.body;
  try {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
      if (err) return res.status(500).json({ error: err });
      const complaint = new Complaint({ room, description, imageUrl: result.secure_url });
      await complaint.save();
      res.json(complaint);
    });
    req.file.stream.pipe(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
});

router.put('/:id', async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
  res.json(complaint);
});

module.exports = router;
