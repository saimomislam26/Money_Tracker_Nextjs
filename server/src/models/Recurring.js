const mongoose = require('mongoose')

const recurringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  note: { type: String, trim: true, default: '' },
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
  startDate: { type: Date, required: true },
  nextDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Recurring', recurringSchema)
