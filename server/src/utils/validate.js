const ApiError = require('./apiError')

// validate(schema, 'body' | 'query' | 'params')
module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source])
  if (!result.success) {
    const errors = {}
    result.error.issues.forEach((i) => { errors[i.path.join('.') || 'value'] = i.message })
    return next(new ApiError(400, Object.values(errors)[0] || 'Validation error', errors))
  }
  // drop undefined keys so partial updates never overwrite fields with undefined
  req[source] = Object.fromEntries(Object.entries(result.data).filter(([, v]) => v !== undefined))
  next()
}
