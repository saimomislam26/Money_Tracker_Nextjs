// One-off: converts data from the old schema (Spending docs + user.monthlyIncomes) into Transactions.
// Usage: npm run migrate   (safe to re-run; skips users that already have transactions)
const mongoose = require('mongoose')
const env = require('../config/env')
const User = require('../models/User')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const { ensureDefaults } = require('../services/categoryService')

;(async () => {
  await mongoose.connect(env.dbUrl)
  const db = mongoose.connection.db
  const hasSpending = (await db.listCollections({ name: 'spendings' }).toArray()).length > 0
  const users = await db.collection('users').find({}).toArray()
  for (const u of users) {
    if (await Transaction.exists({ user: u._id })) { console.log(`skip ${u.email} (already has transactions)`); continue }
    await ensureDefaults(u._id)
    const docs = []
    // legacy categories keep their ids so spendings still resolve; mark them as expense categories
    await db.collection('categories').updateMany({ user: u._id, type: { $exists: false } }, { $set: { type: 'expense', color: '#6366f1', icon: 'tag' } })
    if (hasSpending) {
      const spendings = await db.collection('spendings').find({ user: u._id }).toArray()
      for (const sp of spendings) for (const d of sp.days || []) for (const c of d.categories || []) {
        if (c.amount > 0) docs.push({ user: u._id, type: 'expense', amount: c.amount, category: c.category, note: '', date: new Date(Date.UTC(sp.year, sp.month - 1, d.day)) })
      }
    }
    const salary = await Category.findOne({ user: u._id, type: 'income', name: 'Salary' })
    for (const m of u.monthlyIncomes || []) {
      if (m.income > 0 && salary) docs.push({ user: u._id, type: 'income', amount: m.income, category: salary._id, note: 'Monthly income', date: new Date(Date.UTC(m.year, m.month - 1, 1)) })
    }
    if (docs.length) await Transaction.insertMany(docs)
    await User.updateOne({ _id: u._id }, { $set: { currency: u.currency || 'USD' } })
    console.log(`migrated ${u.email}: ${docs.length} transactions`)
  }
  await mongoose.disconnect()
})().catch((e) => { console.error(e); process.exit(1) })
