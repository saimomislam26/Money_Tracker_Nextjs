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
        if (!isValid) return res.status(400).json({message: "wrong credential"});

        const userTokenData = {
            "_id": user._id,
            "email": user.email,
        };

        const { firstName, lastName } = user
        const expirationDate =  new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
        // new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(); 
        const token = tokenGeneration(userTokenData);
        // Secure; HttpOnly;
        const cookie = `token=${token};SameSite=None;Secure;Expires=${expirationDate}; Path=/;`
        res.setHeader('set-cookie', [cookie])

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


module.exports.dummyFunction = async(req,res)=>{
    return res.status(200).json({message:"Successfully fetched"})
}