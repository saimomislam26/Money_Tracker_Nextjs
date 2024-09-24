const {body, check} = require("express-validator")

module.exports.createSpendigValidation = [
    body('year').isInt({ min: 1900, max: 2100 }).withMessage('Invalid year'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
    body('day').isInt({ min: 1, max: 31 }).withMessage('Invalid day'),
    body('categories.*.category').isMongoId().withMessage('Invalid category ID'),
    body('categories.*.amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
]

module.exports.viewAllSpendigValidation = [
    check('year').isInt({ min: 1900, max: 2100 }).withMessage('Invalid year'),
    check('month').isInt({ min: 1, max: 12 }).withMessage('Invalid month')
]

