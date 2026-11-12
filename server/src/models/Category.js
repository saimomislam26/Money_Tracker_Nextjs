const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: 'tag' },
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)
