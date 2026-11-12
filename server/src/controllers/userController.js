const cloudinary = require('cloudinary').v2
const fs = require('fs/promises')
const User = require('../models/User')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const Goal = require('../models/Goal')
const Recurring = require('../models/Recurring')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { hashPassword, verifyPassword } = require('../services/authService')
const { publicUser } = require('./authController')
const { isDemo } = require('../services/demoService')

const blockDemo = (req) => { if (isDemo(req.user.email)) throw new ApiError(403, 'This is the shared demo account — create your own account to change this.') }

exports.updateProfile = asyncHandler(async (req, res) => {
  if (req.body.email || req.body.firstName || req.body.lastName) blockDemo(req)
  if (req.body.email && req.body.email !== req.user.email && (await User.exists({ email: req.body.email }))) {
    throw new ApiError(409, 'That email is already in use')
  }
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true })
  res.json({ user: publicUser(user), message: 'Profile updated' })
})

exports.changePassword = asyncHandler(async (req, res) => {
  blockDemo(req)
  const user = await User.findById(req.userId)
  if (!(await verifyPassword(req.body.currentPassword, user.password))) throw new ApiError(400, 'Current password is incorrect')
  user.password = await hashPassword(req.body.newPassword)
  await user.save()
  res.json({ message: 'Password changed' })
})

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image provided')
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'money-tracker/avatars', resource_type: 'image' })
    const user = await User.findByIdAndUpdate(req.userId, { profileImageUrl: result.secure_url }, { new: true })
    res.json({ user: publicUser(user), message: 'Photo updated' })
  } finally {
    fs.unlink(req.file.path).catch(() => {})
  }
})

exports.deleteAccount = asyncHandler(async (req, res) => {
  blockDemo(req)
  const user = await User.findById(req.userId)
  if (!(await verifyPassword(req.body.password || '', user.password))) throw new ApiError(400, 'Password is incorrect')
  await Promise.all([Transaction, Category, Budget, Goal, Recurring].map((M) => M.deleteMany({ user: req.userId })))
  await user.deleteOne()
  res.json({ message: 'Account deleted' })
})
