const {body} = require("express-validator")

module.exports.createEmployeeValidation = [
    body("firstName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("lastName").notEmpty().isString().isLength({min: 2}).withMessage("Invalid Name").trim(),
    body("email").notEmpty().isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").notEmpty().isString().isLength({min: 5}).withMessage("Invalid Password"),
]
