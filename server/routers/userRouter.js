const express = require('express')
const { createUser, loginUser, updateUser, getUserInfo, setMonthlyIncome, uploadProfileImage, verifyToken } = require('../controllers/userController')
const { createEmployeeValidation, updateEmployeeValidation } = require('../utils/validator/userValidation')
const Authorize = require('../middleware/authorization')
const { uploadSingleFile } = require('../middleware/uploadFile')
const router = express.Router()


router.route('/create-user').post(createEmployeeValidation, createUser)
router.route('/verify/:token').get(verifyToken)
router.route('/upload-profile-pic').put(Authorize,uploadSingleFile, uploadProfileImage)
router.route('/login-user').post(loginUser)
router.route('/update-user').put(Authorize, updateEmployeeValidation, updateUser)
router.route('/get-user-info').get(Authorize, getUserInfo)
router.route('/set-user-monthly-income').post(Authorize, setMonthlyIncome)

module.exports = router