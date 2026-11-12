// Creates (or resets) the public demo account with ~6 months of realistic data.
const User = require('../models/User')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const Goal = require('../models/Goal')
const Recurring = require('../models/Recurring')
const { hashPassword } = require('./authService')
const { ensureDefaults } = require('./categoryService')

const rnd = (min, max) => Math.round((min + Math.random() * (max - min)) * 100) / 100
const pick = (a) => a[Math.floor(Math.random() * a.length)]

const DEMO = { email: 'demo@example.com', password: 'Demo@12345' }
exports.DEMO = DEMO
exports.isDemo = (email) => email === DEMO.email

// Idempotent: only seeds when the demo user is missing, unless force is true.
exports.seedDemo = async ({ force = false } = {}) => {
  if (!force && (await User.exists({ email: DEMO.email }))) return 0
  let user = await User.findOne({ email: DEMO.email })
  if (!user) user = await User.create({ firstName: 'Demo', lastName: 'User', email: DEMO.email, password: await hashPassword(DEMO.password) })
  await Promise.all([Transaction, Budget, Goal, Recurring, Category].map((M) => M.deleteMany({ user: user._id })))
  await ensureDefaults(user._id)
  const cats = Object.fromEntries((await Category.find({ user: user._id })).map((c) => [c.name, c._id]))

  const now = new Date()
  const docs = []
  const add = (type, cat, amount, note, y, m, d) => {
    const date = new Date(Date.UTC(y, m, d))
    if (date <= now) docs.push({ user: user._id, type, category: cats[cat], amount, note, date })
  }
  const spend = [
    ['Food & Dining', ['Lunch', 'Dinner out', 'Coffee', 'Pizza night'], 8, 45, 14],
    ['Groceries', ['Weekly groceries', 'Fresh produce', 'Supermarket'], 30, 120, 6],
    ['Transport', ['Uber', 'Fuel', 'Metro card'], 5, 60, 8],
    ['Shopping', ['Clothes', 'Headphones', 'Home decor'], 20, 160, 3],
    ['Entertainment', ['Movie tickets', 'Streaming', 'Concert'], 10, 80, 3],
    ['Health', ['Pharmacy', 'Gym pass'], 15, 90, 2],
  ]
  for (let i = 5; i >= 0; i--) {
    const d0 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    const y = d0.getUTCFullYear(), m = d0.getUTCMonth()
    add('income', 'Salary', 4200, 'Monthly salary', y, m, 1)
    if (Math.random() > 0.4) add('income', 'Freelance', rnd(300, 900), 'Side project', y, m, 12 + Math.floor(Math.random() * 10))
    add('expense', 'Housing & Rent', 1250, 'Rent', y, m, 2)
    add('expense', 'Utilities', rnd(90, 150), 'Electricity & internet', y, m, 10)
    for (const [cat, notes, lo, hi, count] of spend) {
      for (let k = 0; k < count; k++) add('expense', cat, rnd(lo, hi), pick(notes), y, m, 1 + Math.floor(Math.random() * 28))
    }
    if (Math.random() > 0.6) add('expense', 'Travel', rnd(150, 500), 'Weekend trip', y, m, 20)
  }
  await Transaction.insertMany(docs)
  await Budget.insertMany([['Food & Dining', 400], ['Groceries', 500], ['Transport', 200], ['Shopping', 300], ['Entertainment', 150]].map(([n, a]) => ({ user: user._id, category: cats[n], amount: a })))
  await Goal.insertMany([
    { user: user._id, name: 'Emergency fund', targetAmount: 10000, savedAmount: 4300, color: '#10b981', deadline: new Date(Date.UTC(now.getUTCFullYear() + 1, 5, 1)) },
    { user: user._id, name: 'Japan trip', targetAmount: 3500, savedAmount: 1200, color: '#f43f5e', deadline: new Date(Date.UTC(now.getUTCFullYear() + 1, 2, 1)) },
    { user: user._id, name: 'New laptop', targetAmount: 1800, savedAmount: 1650, color: '#6366f1' },
  ])
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 28))
  await Recurring.insertMany([
    { user: user._id, type: 'expense', category: cats['Entertainment'], amount: 15.99, note: 'Streaming subscription', frequency: 'monthly', startDate: first, nextDate: first > now ? first : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 28)) },
    { user: user._id, type: 'expense', category: cats['Health'], amount: 39, note: 'Gym membership', frequency: 'monthly', startDate: first, nextDate: first > now ? first : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 28)) },
  ])
  return docs.length
}
