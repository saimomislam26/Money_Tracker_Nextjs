const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')
const { hashPasswordGenarator, verifyHash, tokenGeneration } = require('../services/userServices')

module.exports.createCategory = async (req, res) => {
    try {
        const errors = validationMessages(validationResult(req).mapped())

        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })
        const { name } = req.body

        const userId = new mongoose.Types.ObjectId(req.userId)

        const user = await User.findById({ _id: userId })
        if (!user) return res.status(404).json({ message: "User not found" })

        const saveCategory = await new Category({ user: userId, name }).save()

        return res.status(200).json({ saveCategory, message: "Created Successfully" })
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
        const userId = req.userId

        const category = await Category.find({ user: userId }).select('name')

        if (!category) return res.status(404).json({ message: "Category not found" })

        return res.status(200).json(category)
    } catch (error) {
        console.log(error);

        return res.status(500).json({ "message": "Something went wrong" })
    }


}

module.exports.getSearchCategory = async (req, res) => {

    const userId =new mongoose.Types.ObjectId(req.userId);
    const { searchingCategory } = req.query;

    if(!searchingCategory) return res.status(400).json({message:"Searching query is empty"})

    try {
        // Use regex for partial matching, case-insensitive
        const regex = new RegExp(searchingCategory, 'i');

        console.log({searchingCategory});
        
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

module.exports.deleteCategory = async(req,res)=>{
    try{
        const userId = req.userId
        const categoryId = req.params.id

        const category = await Category.findById(categoryId)

        if (!category) return res.status(404).json({ message: "Category not found" })

        const deletedCategory = await Category.findByIdAndDelete(categoryId)
        
        const afterDeletedAllCategory = await Category.find({user:userId}).select('name')

        return res.status(200).json({message:"Deleted Successfully", afterDeletedAllCategory})
    }catch(error){
        console.log(err.message);
        res.status(500).json({ error: error.message });
    }
}