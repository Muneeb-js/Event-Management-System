import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getDashboardData, approveEvent, rejectEvent } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/').get(getDashboardData);
router.route('/events/:id/approve').patch(approveEvent);
router.route('/events/:id/reject').patch(rejectEvent);

export default router;
