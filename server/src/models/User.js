const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  profileImageUrl: String,
  currency: { type: String, default: 'USD' },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
