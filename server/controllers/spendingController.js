const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Spending = require('../models/spendingModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')

module.exports.createSpending = async (req, res) => {
    const errors = validationMessages(validationResult(req).mapped())

    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })

    var { year, month, day, categories } = req.body;
    const userId = req.userId;

    day = Number(day)
    month = Number(month)
    year = Number(year)

    
    try {
        let spending = await Spending.findOne({ user: userId, year, month });

        if (!spending) {
            spending = new Spending({ user: userId, year, month, days: [] });
        } else if (spending.isLocked) {
            return res.status(400).json({ message: "Cannot modify a locked month's data" });
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
        res.status(200).json({populatedSpending, message:"Expense Saved Successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports.getAllSpending = async (req, res) => {
    const { year, month } = req.params;

    const errors = validationMessages(validationResult(req).mapped());
    
    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors });
    
    console.log(year, month);
    
    const userId = req.userId;
    const { sort = 'serial' } = req.query;
    
    try {
        const spending = await Spending.findOne({ user: userId, year, month })
            .populate('days.categories.category');
    
        if (!spending) {
            return res.status(404).json({ message: "No spending data found for this month" });
        }
    
        // Function to get the total days in the month
        const totalDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    
        const daysInMonth = totalDaysInMonth(year, month); // Get the total number of days in the month
    
        let response = Array.from({ length: daysInMonth }, (_, i) => {
            const currentDay = i + 1;
            const dayData = spending.days.find(day => day.day === currentDay);
    
            if (dayData) {
                // If the day is in the database, return its data
                const totalSpending = dayData.categories.reduce((sum, cat) => sum + cat.amount, 0);
                return {
                    day: currentDay,
                    categories: dayData.categories.map(cat => ({
                        _id: cat.category._id,
                        category: cat.category.name,
                        amount: cat.amount,
                    })),
                    totalSpending,
                    totalCategory:dayData.categories.length
                };
            } else {
                // If the day is not in the database, return an empty categories array
                return {
                    day: currentDay,
                    categories: [],
                    totalSpending: 0,
                    totalCategory:0
                };
            }
        });
    
        // Sorting the response based on total spending, if needed
        if (sort !== 'serial') {
            response = response.sort((a, b) => {
                return sort === 'asc' ? a.totalSpending - b.totalSpending : b.totalSpending - a.totalSpending;
            });
        }
    
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}