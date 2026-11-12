const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const validate = require('../utils/validate')
const s = require('../utils/schemas')
const authC = require('../controllers/authController')
const userC = require('../controllers/userController')
const catC = require('../controllers/categoryController')
const txC = require('../controllers/transactionController')
const budC = require('../controllers/budgetController')
const goalC = require('../controllers/goalController')
const recC = require('../controllers/recurringController')
const anC = require('../controllers/analyticsController')
const { processDue } = require('../services/recurringService')
const asyncHandler = require('../utils/asyncHandler')

const r = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts, try again later' } })

r.get('/health', (_req, res) => res.json({ status: 'ok' }))

r.post('/auth/register', authLimiter, validate(s.register), authC.register)
r.post('/auth/login', authLimiter, validate(s.login), authC.login)

r.use(auth)
r.get('/auth/me', authC.me)

r.put('/users/me', validate(s.profile), userC.updateProfile)
r.put('/users/me/password', validate(s.password), userC.changePassword)
r.put('/users/me/avatar', upload, userC.uploadAvatar)
r.delete('/users/me', userC.deleteAccount)

r.route('/categories').get(catC.list).post(validate(s.category), catC.create)
r.route('/categories/:id').put(validate(s.category.partial()), catC.update).delete(catC.remove)

const dueFirst = asyncHandler(async (req, _res, next) => { await processDue(req.userId); next() })
r.get('/transactions', dueFirst, validate(s.transactionQuery, 'query'), txC.list)
r.get('/transactions/export', validate(s.transactionQuery.partial(), 'query'), txC.exportCsv)
r.post('/transactions', validate(s.transaction), txC.create)
r.route('/transactions/:id').put(validate(s.transaction), txC.update).delete(txC.remove)

r.route('/budgets').get(validate(s.monthQuery, 'query'), budC.list).put(validate(s.budget), budC.upsert)
r.delete('/budgets/:id', budC.remove)

r.route('/goals').get(goalC.list).post(validate(s.goal), goalC.create)
r.route('/goals/:id').put(validate(s.goal.partial()), goalC.update).delete(goalC.remove)
r.post('/goals/:id/contribute', validate(s.contribution), goalC.contribute)

r.route('/recurring').get(recC.list).post(validate(s.recurring), recC.create)
r.route('/recurring/:id').put(validate(s.recurring), recC.update).delete(recC.remove)

r.get('/analytics/dashboard', validate(s.monthQuery, 'query'), anC.dashboard)
r.get('/analytics/yearly', validate(s.yearQuery, 'query'), anC.yearly)

module.exports = r
