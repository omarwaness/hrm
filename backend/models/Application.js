
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  cv: {
    type: String, // This will store the filename or file path
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', ApplicationSchema);
