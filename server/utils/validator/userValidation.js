const {body} = require("express-validator")

module.exports.createEmployeeValidation = [
    body("firstName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("lastName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("email").notEmpty().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").notEmpty().isString().isLength({min: 5}).withMessage("Invalid Password"),
]

module.exports.updateEmployeeValidation = [
    body("firstName").optional().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("lastName").optional().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("email").optional().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").optional().isString().isLength({min: 5}).withMessage("Invalid Password"),
    body("income").optional().isNumeric().withMessage("Invalid Income value")
]
