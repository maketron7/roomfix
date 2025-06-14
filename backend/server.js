require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const complaints = require('./routes/complaints');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default root route for testing
app.get('/', (req, res) => {
  res.send('RoomFix Backend is working!');
});

// API route
app.use('/api/complaints', complaints);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

