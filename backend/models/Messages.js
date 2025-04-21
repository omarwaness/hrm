const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {  // Note: Using "receiver" instead of "reciever" for consistency
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  favorite: {  // Changed from "stared" to "favorite" to match the frontend
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);