const Goal = require('../models/Goal')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')

const find = async (req) => {
  const g = await Goal.findOne({ _id: req.params.id, user: req.userId })
  if (!g) throw new ApiError(404, 'Goal not found')
  return g
}

exports.list = asyncHandler(async (req, res) => res.json({ goals: await Goal.find({ user: req.userId }).sort({ createdAt: -1 }) }))
exports.create = asyncHandler(async (req, res) => res.status(201).json({ goal: await Goal.create({ ...req.body, user: req.userId }) }))
exports.update = asyncHandler(async (req, res) => {
  const g = await find(req)
  Object.assign(g, req.body)
  await g.save()
  res.json({ goal: g })
})
exports.contribute = asyncHandler(async (req, res) => {
  const g = await find(req)
  const next = g.savedAmount + req.body.amount
  if (next < 0) throw new ApiError(400, 'Cannot withdraw more than saved')
  g.savedAmount = next
  g.contributions.push(req.body)
  await g.save()
  res.json({ goal: g, message: req.body.amount > 0 ? 'Contribution added' : 'Withdrawal recorded' })
})
exports.remove = asyncHandler(async (req, res) => {
  await (await find(req)).deleteOne()
  res.json({ message: 'Goal deleted' })
})
