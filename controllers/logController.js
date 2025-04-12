// controllers/logController.js
import Log from '../models/log.js';
import { createResponse } from '../utils/helpers.js';

export const createLog = async (req, res, next) => {
  try {
    const responseTime = req.startTime ? Date.now() - req.startTime : 0; // Default to 0 if undefined
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode || 200,
      responseTime: responseTime, // Use the calculated or default value
      userId: req.user ? req.user : null,
      payload: req.body || req.query,
    };

    await Log.create(logData);
    next();
  } catch (error) {
    console.error('Error creating log:', error);
    next(); // Continue even if logging fails
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.status(200).json(createResponse(true, 'Logs retrieved successfully', logs));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

export const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await Log.find({ userId })
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.status(200).json(createResponse(true, 'User logs retrieved successfully', logs));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};