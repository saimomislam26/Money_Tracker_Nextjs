const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Spending = require('../models/spendingModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')
const { hashPasswordGenarator, verifyHash, tokenGeneration } = require('../services/userServices')

module.exports.createCategory = async (req, res) => {
    try {
        const errors = validationMessages(validationResult(req).mapped())

        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })

        const { name, year, month } = req.body;
        const userId = new mongoose.Types.ObjectId(req.userId)

        const user = await User.findById({ _id: userId })
        if (!user) return res.status(404).json({ message: "User not found" })

        const saveCategory = await new Category({
            user: userId,
            name,
            year: year || null,  // null if not provided (general category)
            month: month || null  // null if not provided (general category)
        }).save();

        return res.status(200).json({ saveCategory: { _id: saveCategory._id, name: saveCategory.name }, message: "Created Successfully" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" })
    }

}

module.exports.updateCategory = async (req, res) => {
    try {

        const catagoryId = req.params.id

        const category = await Category.findById(catagoryId)

        if (!category) return res.status(404).json({ message: "Category not found" })

        const { name } = req.body

        if (!name) return res.status(400).json({ message: "Category name should be provided" })

        const updatedCategory = await Category.findByIdAndUpdate(catagoryId, { ...req.body }, { new: true })

        return res.status(200).json({ updatedCategory, message: "Category Updated Successfully" })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ "message": "Something went wrong" })
    }
}

module.exports.getAllCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { year, month } = req.query;  // Get year and month from query parameters

        // Find general categories (year and month are null)
        const generalCategories = await Category.find({ user: userId, year: null, month: null }).select('name');

        // Find monthly categories if year and month are provided
        let monthlyCategories = [];
        if (year && month) {
            monthlyCategories = await Category.find({
                user: userId,
                year: Number(year),  // Ensure year and month are numbers
                month: Number(month)
            }).select('name');
        }

        const categories = [...generalCategories, ...monthlyCategories];  // Combine both general and monthly categories

        if (!categories.length) return res.status(404).json({ message: "Category not found" });

        return res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports.getSearchCategory = async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.userId);
    const { searchingCategory } = req.query;

    if (!searchingCategory) return res.status(400).json({ message: "Searching query is empty" })

    try {
        // Use regex for partial matching, case-insensitive
        const regex = new RegExp(searchingCategory, 'i');

        console.log({ searchingCategory });

        // Find categories that match the query for the specific user
        const categories = await Category.find({
            user: userId,
            name: { $regex: regex }
        }).select("name");

        if (categories.length === 0) {
            return res.status(404).json({ message: 'No matching categories found' });
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const categoryId = new mongoose.Types.ObjectId(req.params.id);

        // Check if the category exists
        const category = await Category.findOne({ _id: categoryId, user: userId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Delete the category from the Category schema
        await Category.findByIdAndDelete(categoryId);

        // Update all Spending documents by removing the deleted category from days.categories array
        await Spending.updateMany(
            { "days.categories.category": categoryId },
            { $pull: { "days.$[].categories": { category: categoryId } } }
        );

        // Retrieve all remaining categories for the user
        const afterDeletedAllCategory = await Category.find({ user: userId }).select('name');

        return res.status(200).json({
            message: "Deleted Successfully",
            afterDeletedAllCategory
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}