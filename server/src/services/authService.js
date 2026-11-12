const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../config/env')

exports.hashPassword = (password) => bcrypt.hash(password, 12)
exports.verifyPassword = (password, hash) => bcrypt.compare(password, hash)
exports.signToken = (user) => jwt.sign({ _id: user._id, email: user.email }, env.jwtSecret, { algorithm: 'HS256', expiresIn: env.tokenExpires })
exports.verifyToken = (token) => jwt.verify(token, env.jwtSecret)
