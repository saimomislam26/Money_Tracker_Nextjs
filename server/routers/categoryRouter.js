const express = require('express')
const Authorize = require('../middleware/authorization')
const { createCategoryValidation } = require('../utils/validator/categoryValidation')
const { createCategory, updateCategory, getAllCategory, getSearchCategory, deleteCategory } = require('../controllers/categoryController')
const router = express.Router()


router.route('/create-category').post(Authorize, createCategoryValidation, createCategory)
router.route('/update-category/:id').put(Authorize, updateCategory)
router.route('/get-all-category').get(Authorize, getAllCategory)
router.route('/get-search-category').get(Authorize,createCategoryValidation, getSearchCategory)
router.route('/delete-category/:id').delete(Authorize, deleteCategory)

module.exports = router