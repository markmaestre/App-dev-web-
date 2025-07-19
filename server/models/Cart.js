const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);