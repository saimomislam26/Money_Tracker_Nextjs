const mongoose = require('mongoose');

const externalIncomeSchema = new mongoose.Schema({
    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    }
  }, { _id: false });
  
  const monthlyIncomeSchema = new mongoose.Schema({
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    externalIncomeSources: [externalIncomeSchema]
  }, { _id: false });

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
    },
    monthlyIncomes: [monthlyIncomeSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
