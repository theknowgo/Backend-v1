// routes/logRoutes.js
import express from 'express';
import { getAllLogs, getLogsByUser } from '../controllers/logController.js';
import { authUser } from '../middlewares/authMiddleware.js'; // Only import authUser here
import isAdmin from '../middlewares/adminMiddleware.js'; // Import isAdmin from adminMiddleware.js

const router = express.Router();

// Protected routes (require authentication and admin access)
router.get('/logs', authUser, isAdmin, getAllLogs);
router.get('/logs/user/:userId', authUser, isAdmin, getLogsByUser);

export default router;