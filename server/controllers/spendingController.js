const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Spending = require('../models/spendingModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')

module.exports.createSpending = async (req, res) => {
    const errors = validationMessages(validationResult(req).mapped())

    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })

    const { year, month, day, categories } = req.body;
    const userId = req.userId;

    try {
        let spending = await Spending.findOne({ user: userId, year, month });

        if (!spending) {
            spending = new Spending({ user: userId, year, month, days: [] });
        } else if (spending.isLocked) {
            return res.status(400).json({ error: "Cannot modify a locked month's data" });
        }

        const dayIndex = spending.days.findIndex(d => d.day === day);

        if (dayIndex >= 0) {
            categories.forEach(categoryInput => {
                const categoryIndex = spending.days[dayIndex].categories.findIndex(c => c.category.equals(categoryInput.category));

                if (categoryIndex >= 0) {
                    spending.days[dayIndex].categories[categoryIndex].amount += categoryInput.amount;
                } else {
                    spending.days[dayIndex].categories.push({
                        category: categoryInput.category,
                        amount: categoryInput.amount
                    });
                }
            });
        } else {
            spending.days.push({
                day,
                categories: categories.map(categoryInput => ({
                    category: categoryInput.category,
                    amount: categoryInput.amount
                }))
            });
        }

        await spending.save();
        const populatedSpending = await Spending.findById(spending._id).populate('days.categories.category', 'name');
        res.status(200).json(populatedSpending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports.getAllSpending = async (req, res) => {
    const { year, month } = req.params;

    const errors = validationMessages(validationResult(req).mapped())

    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })

    console.log(year, month);

    const userId = req.userId;
    const { sort = 'serial' } = req.query;

    try {
        const spending = await Spending.findOne({ user: userId, year, month })
            .populate('days.categories.category');

        if (!spending) {
            return res.status(404).json({ error: "No spending data found for this month" });
        }

        let response = spending.days.map(day => {
            const totalSpending = day.categories.reduce((sum, cat) => sum + cat.amount, 0);
            return {
                day: day.day,
                categories: day.categories.map(cat => ({
                    _id: cat.category._id,
                    category: cat.category.name,
                    amount: cat.amount
                })),
                totalSpending
            };
        });

        if (sort !== 'serial') {
            response = response.sort((a, b) => {
                return sort === 'asc' ? a.totalSpending - b.totalSpending : b.totalSpending - a.totalSpending;
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}