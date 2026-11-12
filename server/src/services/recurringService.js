const Recurring = require('../models/Recurring')
const Transaction = require('../models/Transaction')
const { advance, startOfToday } = require('../utils/dates')

// Materialise every due recurring entry into real transactions (idempotent: nextDate moves forward).
exports.processDue = async (userId) => {
  const today = startOfToday()
  const due = await Recurring.find({ user: userId, active: true, nextDate: { $lte: today } })
  for (const r of due) {
    const docs = []
    let next = r.nextDate
    let guard = 0
    while (next <= today && guard++ < 60) {
      docs.push({ user: userId, type: r.type, amount: r.amount, category: r.category, note: r.note, date: next, recurring: r._id })
      next = advance(next, r.frequency, r.startDate.getUTCDate())
    }
    if (docs.length) await Transaction.insertMany(docs)
    r.nextDate = next
    await r.save()
  }
}
