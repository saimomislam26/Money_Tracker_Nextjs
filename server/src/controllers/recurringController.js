const Recurring = require('../models/Recurring')
const Category = require('../models/Category')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { processDue } = require('../services/recurringService')

const check = async (req) => {
  const cat = await Category.findOne({ _id: req.body.category, user: req.userId, type: req.body.type })
  if (!cat) throw new ApiError(400, 'Category does not match the type')
}

exports.list = asyncHandler(async (req, res) => {
  res.json({ recurring: await Recurring.find({ user: req.userId }).sort({ nextDate: 1 }).populate('category', 'name color icon type') })
})
exports.create = asyncHandler(async (req, res) => {
  await check(req)
  const r = await Recurring.create({ ...req.body, user: req.userId, nextDate: req.body.startDate })
  await processDue(req.userId)
  res.status(201).json({ recurring: await r.populate('category', 'name color icon type'), message: 'Recurring entry created' })
})
exports.update = asyncHandler(async (req, res) => {
  await check(req)
  const r = await Recurring.findOne({ _id: req.params.id, user: req.userId })
  if (!r) throw new ApiError(404, 'Not found')
  const { startDate, ...rest } = req.body
  Object.assign(r, rest)
  await r.save()
  res.json({ recurring: await r.populate('category', 'name color icon type') })
})
exports.remove = asyncHandler(async (req, res) => {
  const r = await Recurring.findOneAndDelete({ _id: req.params.id, user: req.userId })
  if (!r) throw new ApiError(404, 'Not found')
  res.json({ message: 'Recurring entry deleted' })
})
