const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['event', 'charity'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);