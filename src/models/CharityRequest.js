const mongoose = require('mongoose');

const charityRequestSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  collectedAmount: {
    type: Number,
    default: 0        
  },
  payment_link: {
    type: String,     
    default: null
  },
  donors: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: {
        type: Number  
      }
    }
  ],
  files: [
    {
      originalName: { type: String },
      path: { type: String },
      mimetype: { type: String }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

charityRequestSchema.pre('save', function (next) {
  if (this.collectedAmount >= this.targetAmount) {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('CharityRequest', charityRequestSchema);