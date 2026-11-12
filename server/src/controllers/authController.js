const User = require('../models/User')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { hashPassword, verifyPassword, signToken } = require('../services/authService')
const { ensureDefaults } = require('../services/categoryService')

const publicUser = (u) => ({ _id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email, profileImageUrl: u.profileImageUrl || null, currency: u.currency || 'USD' })
exports.publicUser = publicUser

exports.register = asyncHandler(async (req, res) => {
  if (await User.findOne({ email: req.body.email })) throw new ApiError(409, 'An account with this email already exists')
  const user = await User.create({ ...req.body, password: await hashPassword(req.body.password) })
  await ensureDefaults(user._id)
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await verifyPassword(req.body.password, user.password))) throw new ApiError(401, 'Incorrect email or password')
  await ensureDefaults(user._id)
  res.json({ token: signToken(user), user: publicUser(user) })
})

exports.me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }))
