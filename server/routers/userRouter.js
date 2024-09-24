const express = require('express')
const { createUser, loginUser, dummyFunction } = require('../controllers/userController')
const { createEmployeeValidation } = require('../utils/validator/userValidation')
const Authorize = require('../middleware/authorization')
const router = express.Router()


router.route('/create-user').post(createEmployeeValidation, createUser)
router.route('/login-user').post(loginUser)
router.route('/dummyfetch').get(Authorize, dummyFunction)

module.exports = router