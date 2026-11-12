exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, _next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' })
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' })
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({ message: status >= 500 ? 'Something went wrong' : err.message, errors: err.errors })
}
