const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const Recurring = require('../models/Recurring')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { ensureDefaults } = require('../services/categoryService')

exports.list = asyncHandler(async (req, res) => {
  await ensureDefaults(req.userId)
  const categories = await Category.find({ user: req.userId }).sort({ type: 1, name: 1 })
  res.json({ categories })
})

exports.create = asyncHandler(async (req, res) => {
  if (await Category.exists({ user: req.userId, type: req.body.type, name: new RegExp(`^${req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })) {
    throw new ApiError(409, 'A category with this name already exists')
  }
  const category = await Category.create({ ...req.body, user: req.userId })
  res.status(201).json({ category })
})

exports.update = asyncHandler(async (req, res) => {
  const { name, color, icon } = req.body // type is immutable once transactions reference it
  const category = await Category.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { name, color, icon }, { new: true })
  if (!category) throw new ApiError(404, 'Category not found')
  res.json({ category })
})

exports.remove = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.userId })
  if (!category) throw new ApiError(404, 'Category not found')
  const used = await Transaction.countDocuments({ user: req.userId, category: category._id })
  if (used > 0) throw new ApiError(400, `This category has ${used} transaction${used > 1 ? 's' : ''}. Reassign or delete them first.`)
  await Promise.all([Budget.deleteMany({ category: category._id }), Recurring.deleteMany({ category: category._id }), category.deleteOne()])
  res.json({ message: 'Category deleted' })
})
