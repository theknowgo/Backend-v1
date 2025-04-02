// models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },
  payload: {
    type: Object, 
    required: false,
  },
});

const Log = mongoose.model('Log', logSchema);

export default Log;