const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const Recurring = require('../models/Recurring')
const { monthRange, monthKey, addMonths } = require('../utils/dates')

const oid = (id) => new mongoose.Types.ObjectId(id)

const totalsFor = async (userId, start, end) => {
  const rows = await Transaction.aggregate([
    { $match: { user: oid(userId), date: { $gte: start, $lt: end } } },
    { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ])
  const get = (t) => rows.find((r) => r._id === t) || { total: 0, count: 0 }
  const income = get('income').total
  const expense = get('expense').total
  return { income, expense, balance: income - expense, count: get('income').count + get('expense').count }
}

const byCategory = async (userId, start, end, type = 'expense') => {
  const rows = await Transaction.aggregate([
    { $match: { user: oid(userId), type, date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
    { $unwind: '$cat' },
    { $project: { _id: 0, categoryId: '$_id', name: '$cat.name', color: '$cat.color', icon: '$cat.icon', total: 1, count: 1 } },
    { $sort: { total: -1 } },
  ])
  return rows
}

const monthlySeries = async (userId, fromDate, toDate) => {
  const rows = await Transaction.aggregate([
    { $match: { user: oid(userId), date: { $gte: fromDate, $lt: toDate } } },
    { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' }, t: '$type' }, total: { $sum: '$amount' } } },
  ])
  const map = {}
  rows.forEach((r) => {
    const k = `${r._id.y}-${String(r._id.m).padStart(2, '0')}`
    map[k] = map[k] || { income: 0, expense: 0 }
    map[k][r._id.t] = r.total
  })
  return map
}

exports.budgetStatus = async (userId, start, end) => {
  const budgets = await Budget.find({ user: userId }).populate('category', 'name color icon')
  const spent = await byCategory(userId, start, end, 'expense')
  const spentMap = Object.fromEntries(spent.map((s) => [String(s.categoryId), s.total]))
  return budgets
    .filter((b) => b.category)
    .map((b) => {
      const s = spentMap[String(b.category._id)] || 0
      return { _id: b._id, category: b.category, amount: b.amount, spent: s, remaining: b.amount - s, percent: Math.round((s / b.amount) * 100) }
    })
    .sort((a, b) => b.percent - a.percent)
}

exports.dashboard = async (userId, month) => {
  const { start, end, year, month: mon, daysInMonth } = monthRange(month)
  const prevStart = addMonths(start, -1)

  const [current, previous, categories, budgets, recent, upcoming, dailyRows, trendMap] = await Promise.all([
    totalsFor(userId, start, end),
    totalsFor(userId, prevStart, start),
    byCategory(userId, start, end, 'expense'),
    exports.budgetStatus(userId, start, end),
    Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(7).populate('category', 'name color icon'),
    Recurring.find({ user: userId, active: true }).sort({ nextDate: 1 }).limit(4).populate('category', 'name color icon'),
    Transaction.aggregate([
      { $match: { user: oid(userId), date: { $gte: start, $lt: end } } },
      { $group: { _id: { d: { $dayOfMonth: '$date' }, t: '$type' }, total: { $sum: '$amount' } } },
    ]),
    monthlySeries(userId, addMonths(start, -5), end),
  ])

  const daily = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, income: 0, expense: 0 }))
  dailyRows.forEach((r) => { daily[r._id.d - 1][r._id.t] = r.total })

  const trend = Array.from({ length: 6 }, (_, i) => {
    const d = addMonths(start, i - 5)
    const k = monthKey(d)
    return { month: k, income: trendMap[k]?.income || 0, expense: trendMap[k]?.expense || 0 }
  })

  const now = new Date()
  const isCurrent = now.getUTCFullYear() === year && now.getUTCMonth() + 1 === mon
  const elapsed = isCurrent ? now.getUTCDate() : daysInMonth
  const avgDailySpend = elapsed ? current.expense / elapsed : 0

  return {
    month: `${year}-${String(mon).padStart(2, '0')}`,
    totals: {
      ...current,
      savingsRate: current.income > 0 ? Math.round(((current.income - current.expense) / current.income) * 100) : null,
    },
    previous,
    insights: {
      avgDailySpend,
      projectedExpense: isCurrent ? avgDailySpend * daysInMonth : current.expense,
      topCategory: categories[0] || null,
      isCurrentMonth: isCurrent,
    },
    categories,
    daily,
    trend,
    budgets,
    recent,
    upcoming,
  }
}

exports.yearly = async (userId, year) => {
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))
  const [map, expenseCats, incomeCats, totals] = await Promise.all([
    monthlySeries(userId, start, end),
    byCategory(userId, start, end, 'expense'),
    byCategory(userId, start, end, 'income'),
    totalsFor(userId, start, end),
  ])
  const months = Array.from({ length: 12 }, (_, i) => {
    const k = `${year}-${String(i + 1).padStart(2, '0')}`
    const income = map[k]?.income || 0
    const expense = map[k]?.expense || 0
    return { month: k, income, expense, net: income - expense }
  })
  return { year, totals, months, expenseCategories: expenseCats, incomeCategories: incomeCats }
}
