const mongoose = require('mongoose');

const spendingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  days: [{
    day: {
      type: Number,
      required: true,
    },
    categories: [{
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      }
    }]
  }]
}, { timestamps: true });

const Spending = mongoose.model('Spending', spendingSchema);

module.exports = Spending;
