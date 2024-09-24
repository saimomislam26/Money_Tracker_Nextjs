const fs = require("node:fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("node:path");

/**
 * 
 * @param {string} password - User's password
 * @returns {string} Return a hash string
 */
module.exports.hashPasswordGenarator = async (password) => {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword
}

/**
 * 
 * @param {string} password 
 * @param {string} hashpassword 
 * @returns {boolean} 
 */

module.exports.verifyHash = async (password, hashpassword) => {
    const verifyHash = await bcrypt.compare(password, hashpassword);
    return verifyHash;
}


/**
 * 
 * @param {object} userData - Contains user information
 * @returns {string} - jwt token  
 */
module.exports.tokenGeneration = (userData) => {
    const privateKey = process.env.JWT_SECRET_KEY;

    const signOptions = {
        algorithm: "HS256",
        expiresIn: '24h'
    };

    const token = jwt.sign(userData, privateKey, signOptions);
    return token
}

/**
 * 
 * @param {string} token - Token
 * @returns {boolean} -Return a boolean value  
 */
module.exports.verifyToken = (token) => {
    const privateKey = process.env.JWT_SECRET_KEY;
    try {
        const signOptions = {
            algorithm: "HS256",
            expiresIn: '24h'
        };

        const isVerified = jwt.verify(token, privateKey, signOptions);
        return isVerified;

    } catch (err) {
        return false
    }

}