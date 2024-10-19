const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    default: null,  // null for general categories
  },
  month: {
    type: Number,
    default: null,  // null for general categories
  },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
