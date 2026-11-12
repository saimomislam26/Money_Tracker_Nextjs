const mongoose = require('mongoose')

// A monthly spending limit for one expense category.
const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true, min: 1 },
}, { timestamps: true })

budgetSchema.index({ user: 1, category: 1 }, { unique: true })

module.exports = mongoose.model('Budget', budgetSchema)
