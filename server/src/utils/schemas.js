const { z } = require('zod')

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id')
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be YYYY-MM')
const color = z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid color')

exports.register = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
exports.login = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email'), password: z.string().min(1, 'Password is required') })
exports.profile = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  currency: z.string().length(3).toUpperCase().optional(),
})
exports.password = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8, 'New password must be at least 8 characters') })

exports.category = z.object({
  name: z.string().trim().min(1, 'Name is required').max(40),
  type: z.enum(['expense', 'income']).default('expense'),
  color: color.default('#6366f1'),
  icon: z.string().max(30).default('tag'),
})

const txBase = {
  type: z.enum(['expense', 'income']),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: objectId,
  note: z.string().trim().max(200).default(''),
  date: z.coerce.date(),
}
exports.transaction = z.object(txBase)
exports.transactionQuery = z.object({
  type: z.enum(['expense', 'income']).optional(),
  category: objectId.optional(),
  q: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  sort: z.enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc']).default('date_desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
})

exports.budget = z.object({ category: objectId, amount: z.coerce.number().positive('Limit must be greater than 0') })
exports.goal = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60),
  targetAmount: z.coerce.number().positive('Target must be greater than 0'),
  deadline: z.coerce.date().optional().nullable(),
  color: color.default('#10b981'),
})
exports.contribution = z.object({ amount: z.coerce.number().refine((n) => n !== 0, 'Amount cannot be 0'), note: z.string().trim().max(120).default('') })
exports.recurring = z.object(txBase).omit({ date: true }).extend({
  frequency: z.enum(['weekly', 'monthly', 'yearly']).default('monthly'),
  startDate: z.coerce.date(),
  active: z.boolean().default(true),
})
exports.monthQuery = z.object({ month: month.optional() })
exports.yearQuery = z.object({ year: z.coerce.number().int().min(2000).max(2100).default(new Date().getUTCFullYear()) })
