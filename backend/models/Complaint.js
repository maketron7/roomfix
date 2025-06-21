const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  room: String,
  description: String,
  imageUrl: String,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

