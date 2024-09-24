const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    income: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
