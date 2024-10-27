const express = require('express')
const Authorize = require('../middleware/authorization')

const { createSpendigValidation, viewAllSpendigValidation } = require('../utils/validator/spendingValidation')
const { createSpending, getAllSpending } = require('../controllers/spendingController')
const router = express.Router()


router.route('/create-expense').post(Authorize, createSpendigValidation,createSpending )
router.route('/get-all-expense/:year/:month').get(Authorize, viewAllSpendigValidation, getAllSpending )

module.exports = router