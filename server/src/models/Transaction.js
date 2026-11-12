const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  note: { type: String, trim: true, default: '' },
  date: { type: Date, required: true },
  recurring: { type: mongoose.Schema.Types.ObjectId, ref: 'Recurring' },
}, { timestamps: true })

transactionSchema.index({ user: 1, date: -1 })
transactionSchema.index({ user: 1, category: 1, date: -1 })

module.exports = mongoose.model('Transaction', transactionSchema)
