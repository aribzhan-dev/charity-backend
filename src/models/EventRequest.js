const mongoose = require('mongoose');

const eventRequestSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  peopleNeeded: {
    type: Number,
    required: true
  },
  transferDetails: {
    type: Boolean,
    default: false
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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


eventRequestSchema.pre('save', async function () {
  if (this.attendees.length >= this.peopleNeeded) {
    this.status = 'completed';
  }
});

module.exports = mongoose.model('EventRequest', eventRequestSchema);