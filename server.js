require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const complaints = require('./routes/complaints');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/complaints', complaints);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
