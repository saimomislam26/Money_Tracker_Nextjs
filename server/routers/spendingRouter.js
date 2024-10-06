const express = require('express')
const Authorize = require('../middleware/authorization')

const { createSpendigValidation, viewAllSpendigValidation } = require('../utils/validator/spendingValidation')
const { createSpending, getAllSpending, updateSpending, getSummaryOfSpendingSpecificMonth } = require('../controllers/spendingController')
const router = express.Router()


router.route('/create-expense').post(Authorize, createSpendigValidation,createSpending )
router.route('/get-all-expense/:year/:month').get(Authorize, viewAllSpendigValidation, getAllSpending )
router.route('/update-expense').put(Authorize,updateSpending)
router.route('/get-summary-monthly/:year/:month').get(Authorize,getSummaryOfSpendingSpecificMonth)

module.exports = router