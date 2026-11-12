const asyncHandler = require('../utils/asyncHandler')
const analytics = require('../services/analyticsService')
const { processDue } = require('../services/recurringService')

exports.dashboard = asyncHandler(async (req, res) => {
  await processDue(req.userId)
  res.json(await analytics.dashboard(req.userId, req.query.month))
})
exports.yearly = asyncHandler(async (req, res) => res.json(await analytics.yearly(req.userId, req.query.year)))
