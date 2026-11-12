const User = require('../models/User')
const ApiError = require('../utils/apiError')
const asyncHandler = require('../utils/asyncHandler')
const { verifyToken } = require('../services/authService')

module.exports = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new ApiError(401, 'Authentication required')
  let decoded
  try { decoded = verifyToken(token) } catch { throw new ApiError(401, 'Session expired, please sign in again') }
  const user = await User.findById(decoded._id).select('-password')
  if (!user) throw new ApiError(401, 'Account no longer exists')
  req.user = user
  req.userId = user._id
  next()
})
