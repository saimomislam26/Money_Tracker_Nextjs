const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')
const Category = require('../models/Category')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')

const SORTS = { date_desc: { date: -1, createdAt: -1 }, date_asc: { date: 1 }, amount_desc: { amount: -1 }, amount_asc: { amount: 1 } }

const buildFilter = (userId, q) => {
  const f = { user: userId }
  if (q.type) f.type = q.type
  if (q.category) f.category = q.category
  if (q.q) f.note = new RegExp(q.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (q.from || q.to) f.date = { ...(q.from && { $gte: q.from }), ...(q.to && { $lte: q.to }) }
  if (q.min != null || q.max != null) f.amount = { ...(q.min != null && { $gte: q.min }), ...(q.max != null && { $lte: q.max }) }
  return f
}

const assertCategory = async (userId, categoryId, type) => {
  const cat = await Category.findOne({ _id: categoryId, user: userId })
  if (!cat) throw new ApiError(400, 'Category not found')
  if (cat.type !== type) throw new ApiError(400, `Category "${cat.name}" is an ${cat.type} category`)
}

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.query
  const filter = buildFilter(req.userId, req.query)
  const [items, total, sums] = await Promise.all([
    Transaction.find(filter).sort(SORTS[sort]).skip((page - 1) * limit).limit(limit).populate('category', 'name color icon type'),
    Transaction.countDocuments(filter),
    Transaction.aggregate([{ $match: { ...filter, user: new mongoose.Types.ObjectId(req.userId) } }, { $group: { _id: '$type', total: { $sum: '$amount' } } }]),
  ])
  const sum = (t) => sums.find((s) => s._id === t)?.total || 0
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)), totals: { income: sum('income'), expense: sum('expense') } })
})

exports.create = asyncHandler(async (req, res) => {
  await assertCategory(req.userId, req.body.category, req.body.type)
  const tx = await Transaction.create({ ...req.body, user: req.userId })
  res.status(201).json({ transaction: await tx.populate('category', 'name color icon type'), message: 'Transaction added' })
})

exports.update = asyncHandler(async (req, res) => {
  await assertCategory(req.userId, req.body.category, req.body.type)
  const tx = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true }).populate('category', 'name color icon type')
  if (!tx) throw new ApiError(404, 'Transaction not found')
  res.json({ transaction: tx, message: 'Transaction updated' })
})

exports.remove = asyncHandler(async (req, res) => {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId })
  if (!tx) throw new ApiError(404, 'Transaction not found')
  res.json({ message: 'Transaction deleted' })
})

exports.exportCsv = asyncHandler(async (req, res) => {
  const items = await Transaction.find(buildFilter(req.userId, req.query)).sort(SORTS.date_desc).populate('category', 'name')
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = [['Date', 'Type', 'Category', 'Amount', 'Note'].join(',')]
  items.forEach((t) => rows.push([t.date.toISOString().slice(0, 10), t.type, esc(t.category?.name), t.amount, esc(t.note)].join(',')))
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
  res.send(rows.join('\n'))
})
