const {body} = require("express-validator")

module.exports.createCategoryValidation = [
    body("name").notEmpty().withMessage("name field empty").isString().isLength({min: 2}).withMessage("Invalid Category Name").trim(),
]
