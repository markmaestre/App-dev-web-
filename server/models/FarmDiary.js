const mongoose = require('mongoose');

const farmDiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  activities: [String],
  inputs: [{
    type: {
      type: String, // seed, fertilizer, pesticide
      required: true
    },
    name: String,
    quantity: String
  }],
  harvest: {
    crop: String,
    quantity: String,
    notes: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FarmDiary', farmDiarySchema);
