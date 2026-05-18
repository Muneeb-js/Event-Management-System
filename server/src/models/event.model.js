import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String, 
    required: false
  },
  category: {
    type: String,
    required: true,
    default: 'GENERAL'
  },
  department: {
    type: String,
    required: true,
    default: 'All Departments'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  checkedIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }]
}, { timestamps: true });

export const Event = mongoose.model('Event', EventSchema);