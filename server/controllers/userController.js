const cloudinary = require('cloudinary')

const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const { validationMessages, isErrorFounds } = require('../utils/errorMessageHelper')
const { hashPasswordGenarator, verifyHash, tokenGeneration } = require('../services/userServices');
const { cryptoGeneration, sendVerificationMail } = require('../utils/helper');


module.exports.createUser = async (req, res) => {
    const errors = validationMessages(validationResult(req).mapped())

    if (isErrorFounds(errors)) return res.status(400).json({ "message": "Validation Error", errors })
    const { firstName, lastName, email, password } = req.body


    // Check if the user exists and is unverified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (!existingUser.isVerified) {
            // Check if the verification token has expired
            if (existingUser.verificationTokenExpires < Date.now()) {
                // Generate a new token and expiry
                const verificationToken = cryptoGeneration();
                const verificationTokenExpires = Date.now() + 3600000; // 1 hour expiry

                // Update existing user data with new verification details
                existingUser.verificationToken = verificationToken;
                existingUser.verificationTokenExpires = verificationTokenExpires;
                await existingUser.save();

                // Resend verification email
                const verificationLink = `${req.protocol}://${process.env.CLIENT_DOMAIN}/user/verify/${verificationToken}`;
                await sendVerificationMail(verificationLink, email);

                return res.status(200).json({ message: "Previous verification expired. A new verification email has been sent." });
            } else {
                return res.status(400).json({ message: "Email verification pending. Please check your email." });
            }
        } else {
            return res.status(400).json({ message: "User already exists" });
        }
    }

    const hashPassword = await hashPasswordGenarator(password)


    const verificationToken = cryptoGeneration()
    const verificationTokenExpires = Date.now() + 3600000;

    const userData = {
        firstName, lastName, email, password: hashPassword, verificationToken,
        verificationTokenExpires
    }
    const saveUser = await new User(userData).save()

    // Create verification link
    const verificationLink = `${req.protocol}://${process.env.CLIENT_DOMAIN}/user/verify/${verificationToken}`;

    await sendVerificationMail(verificationLink, email)

    return res.status(200).json({ message: "Registration successful. Please check your email for verification link." })
}

module.exports.loginUser = async (req, res) => {
    try {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (!user) return res.status(404).json({ message: "This user is not registered" })
        if (!user.isVerified) return res.status(404).json({ message: "Please verify your email to log in." })

        let isValid = await verifyHash(password, user.password)
        if (!isValid) return res.status(400).json({ message: "wrong credential" });

        if (user.monthlyIncomes && user.income) {
            const existingMonthlyIncome = user.monthlyIncomes.find(m => m.year === Number(year) && m.month === Number(month));
            if (!existingMonthlyIncome) {
                user.monthlyIncomes.push({ year, month, income: user.income })
                await user.save()
            }
        }

        if(!user.monthlyIncomes && user.income){
            user.monthlyIncomes.push({ year, month, income: user.income })
            await user.save()
        }

        const userTokenData = {
            "_id": user._id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "income": user.income,
            "profileImage": user?.profileImageUrl | null,
            "monthlyIncome": user.monthlyIncomes
        };

        const { firstName, lastName } = user
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        // new Date(Date.now() + 24 * 60 * 60 * 1000).toString(); 
        const token = tokenGeneration(userTokenData);
        // ;SameSite=None;Secure; Path=/;
        // ;HttpOnly; Secure; Path=/; SameSite=Strict
        // const cookie = `token=${token};Expires=${expirationDate};HttpOnly; Secure; Path=/; SameSite=None`
        // res.setHeader('set-cookie', [cookie])

        // res.cookie('token', token, {
        //     expires: expirationDate,
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None',
        //     path: '/',     
        // });

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
        // console.log({ userObj });


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

module.exports.verifyToken = async (req, res) => {
    // console.log(req.params.token);

    try {
        const user = await User.findOne({
            verificationToken: req.params.token,
            verificationTokenExpires: { $gt: Date.now() }
        });
        console.log({ user });


        if (!user) {
            return res.status(400).json({ message: 'Verification link is invalid or has expired.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        return res.status(200).json({ "message": "Email Verification Successful" })

        // // Redirect to login page or send a success message
        // res.redirect(`${process.env.CLIENT_URL}/login`); // Ensure you have a route for /login on the client side.
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error });
    }
}