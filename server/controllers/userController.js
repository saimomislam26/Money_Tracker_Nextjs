const cloudinary = require('cloudinary')

const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')
const { hashPasswordGenarator, verifyHash, tokenGeneration } = require('../services/userServices')


module.exports.createUser = async (req, res) => {
    const errors = validationMessages(validationResult(req).mapped())

    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })
    const { firstName, lastName, email, password } = req.body

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists" })

    const hashPassword = await hashPasswordGenarator(password)

    const userData = { firstName, lastName, email, password: hashPassword }

    const saveUser = await new User(userData).save()

    return res.status(200).json({ message: "Created Successfully" })
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (!user) return res.status(404).json({ message: "This user is not registered" })

        let isValid = await verifyHash(password, user.password)
        if (!isValid) return res.status(400).json({ message: "wrong credential" });

        const userTokenData = {
            "_id": user._id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "income": user.income,
            "profileImage": user?.profileImageUrl | null
        };

        const { firstName, lastName } = user
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toString()
        // new Date(Date.now() + 24 * 60 * 60 * 1000).toString(); 
        const token = tokenGeneration(userTokenData);
        // ;SameSite=None;Secure; Path=/;
        // ;HttpOnly; Secure; Path=/; SameSite=Strict
        // const cookie = `token=${token};Expires=${expirationDate};HttpOnly; Secure; Path=/; SameSite=None`
        // res.setHeader('set-cookie', [cookie])

        res.cookie('token', token, {
            expires: expirationDate,
            httpOnly: true,
            secure: true,
            sameSite: 'None', // for cross-origin requests
            path: '/',       // root path
            // Domain attribute is intentionally omitted
        });

        return res.status(200).json({
            message: "Logged in Successfully",
            "_token": token,
            userInfo: {
                firstName,
                lastName,
                email
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" })
    }


}

module.exports.updateUser = async (req, res) => {
    try {

        const errors = validationMessages(validationResult(req).mapped())

        if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })


        const userId = req.userId

        const user = await User.findById(userId)

        if (!user) return res.status(404).json({ message: "User not found" })

        var currentPassword = req.body.currentPassword
        var newPassword = req.body.password

        // If password update
        if (currentPassword && newPassword) {
            let isValid = await verifyHash(currentPassword, user.password)
            if (!isValid) return res.status(400).json({ message: "Current Password Does not match" })
            newPassword = await hashPasswordGenarator(newPassword)
            req.body.password = newPassword
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { ...req.body }, { new: true })

        return res.status(200).json({ updatedUser, message: "User Updated Successfully" })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ "message": "Something went wrong" })
    }
}

module.exports.setMonthlyIncome = async (req, res) => {
    try {
        const userId = req.userId;
        const { year, month, income } = req.body;

        const user = await User.findById(userId).select('income monthlyIncomes');
        if (!user) return res.status(404).json({ message: "User not found" });

        const existingMonthlyIncome = user.monthlyIncomes.find(m => m.year === Number(year) && m.month === Number(month));

        if (existingMonthlyIncome) {
            // Update existing monthly income
            existingMonthlyIncome.income = income;
        } else {
            // Add new monthly income
            user.monthlyIncomes.push({
                year,
                month,
                income,
            });
        }
        await user.save();
        return res.status(200).json({ message: "Income updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }

}

module.exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.userId
        const { year, month } = req.query;

        let user = await User.findById(userId).select('firstName lastName email income monthlyIncomes profileImageUrl')

        if (!user) return res.status(404).json({ message: "User not found" })

        let incomeDetails;
        if (year && month) {
            const monthlyIncome = user.monthlyIncomes.find(m => m.year === Number(year) && m.month === Number(month));

            if (monthlyIncome) {
                // Return the income for the specified month, including external sources
                incomeDetails = {
                    income: monthlyIncome.income
                };
            } else {
                // Return general income if no specific monthly income is found
                incomeDetails = { income: null };
            }
        } else {
            // If no year/month provided, return general income
            incomeDetails = { income: user.income };
        }

        // Convert Mongoose document to a plain object
        const userObj = user.toObject();
        console.log({ userObj });


        // Add the custom field
        userObj.currentMonthIncome = incomeDetails.income;

        return res.status(200).json(userObj)
    } catch (error) {
        console.log(error);

        return res.status(500).json({ "message": "Something went wrong" })
    }


}

module.exports.uploadProfileImage = async (req, res) => {
    // upload.single("myFile")

    console.log(req.file);

    try {
        if (!req.file) {
            return res.status(400).json({ message: "There is no file" })
        }

        try {
            const userId = req.userId

            const user = await User.findById(userId)
            if (!user) return res.status(404).json({ message: "User not found" })

            const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
                folder: "Money Tracker User Profile",
                resource_type: "auto"
            })

            const { secure_url } = cloudinaryUpload

            const updatedUser = await User.findByIdAndUpdate(userId, { profileImageUrl: secure_url }, { new: true })

            res.status(200).json({
                message: "Image Uploaded Successfully",
                profileImageUrl: secure_url
            })

        } catch (error) {
            return res.status(400).json({ message: "Error from Cloudinary" })
        }

    } catch (error) {
        // console.log(error?.message);
        return res.status(500).json({ message: "Internal Server  Error" })
    }

}