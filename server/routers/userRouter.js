const express = require('express')
const { createUser, loginUser, updateUser, getUserInfo } = require('../controllers/userController')
const { createEmployeeValidation, updateEmployeeValidation } = require('../utils/validator/userValidation')
const Authorize = require('../middleware/authorization')
const router = express.Router()


router.route('/create-user').post(createEmployeeValidation, createUser)
router.route('/login-user').post(loginUser)
router.route('/update-user').put(Authorize, updateEmployeeValidation, updateUser)
router.route('/get-user-info').get(Authorize, getUserInfo)

module.exports = router