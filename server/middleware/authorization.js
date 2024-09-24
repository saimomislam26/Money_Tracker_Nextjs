const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { verifyToken, tokenGeneration } = require("../services/userServices");

async function Authorize(req, res, next) {
    const { authorization } = req.headers
    // console.log(authorization);
    //authorization === Bearer ewefwegwrherhe
    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized User" })
    }
    const token = authorization.replace("Bearer ", "")

    try {

        //all user info from database will be saved of this verified token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) return res.status(401).json({ message: "unauthorized User" })

        const rootUser = await User.findOne({ _id: decoded._id })
        if (!rootUser) return res.status(400).send("User Not Found")
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id
        next();
    } catch (err) {
        // console.log(err);
        return res.status(401).json({ message: "unauthorized!No token Provided" })
    }
}

module.exports = Authorize;
