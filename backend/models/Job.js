// models/Job.js

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: {
    type: [String], // Array of strings
    required: true,
  },
  responsibilities: {
    type: [String], // Array of strings
    required: true,
  }
});

module.exports = mongoose.model('Job', JobSchema);
