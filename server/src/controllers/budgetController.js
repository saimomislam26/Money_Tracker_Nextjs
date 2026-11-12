const Budget = require('../models/Budget')
const Category = require('../models/Category')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { budgetStatus } = require('../services/analyticsService')
const { monthRange } = require('../utils/dates')

exports.list = asyncHandler(async (req, res) => {
  const { start, end } = monthRange(req.query.month)
  res.json({ budgets: await budgetStatus(req.userId, start, end) })
})

// Upsert: one limit per category.
exports.upsert = asyncHandler(async (req, res) => {
  const cat = await Category.findOne({ _id: req.body.category, user: req.userId, type: 'expense' })
  if (!cat) throw new ApiError(400, 'Choose an expense category')
  const budget = await Budget.findOneAndUpdate({ user: req.userId, category: cat._id }, { amount: req.body.amount }, { upsert: true, new: true })
  res.json({ budget, message: 'Budget saved' })
})

exports.remove = asyncHandler(async (req, res) => {
  const b = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId })
  if (!b) throw new ApiError(404, 'Budget not found')
  res.json({ message: 'Budget removed' })
})
