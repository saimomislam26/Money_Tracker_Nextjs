const Category = require('../models/Category')

const DEFAULTS = [
  { name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'utensils' },
  { name: 'Groceries', type: 'expense', color: '#84cc16', icon: 'shopping-cart' },
  { name: 'Transport', type: 'expense', color: '#0ea5e9', icon: 'car' },
  { name: 'Housing & Rent', type: 'expense', color: '#8b5cf6', icon: 'home' },
  { name: 'Utilities', type: 'expense', color: '#14b8a6', icon: 'zap' },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag' },
  { name: 'Entertainment', type: 'expense', color: '#f43f5e', icon: 'film' },
  { name: 'Health', type: 'expense', color: '#ef4444', icon: 'heart' },
  { name: 'Education', type: 'expense', color: '#6366f1', icon: 'book' },
  { name: 'Travel', type: 'expense', color: '#06b6d4', icon: 'plane' },
  { name: 'Other', type: 'expense', color: '#64748b', icon: 'tag' },
  { name: 'Salary', type: 'income', color: '#10b981', icon: 'briefcase' },
  { name: 'Freelance', type: 'income', color: '#22c55e', icon: 'laptop' },
  { name: 'Investments', type: 'income', color: '#eab308', icon: 'trending-up' },
  { name: 'Gifts', type: 'income', color: '#d946ef', icon: 'gift' },
]

exports.DEFAULTS = DEFAULTS

// Create the default category set for users that have none (new or migrated accounts).
exports.ensureDefaults = async (userId) => {
  const count = await Category.countDocuments({ user: userId })
  if (count === 0) await Category.insertMany(DEFAULTS.map((c) => ({ ...c, user: userId })))
}
