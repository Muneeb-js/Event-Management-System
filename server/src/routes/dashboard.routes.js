import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getDashboardData, approveEvent, rejectEvent, getUserAlerts, markAlertAsRead } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/').get(getDashboardData);
router.route('/alerts').get(getUserAlerts);
router.route('/alerts/:id/read').patch(markAlertAsRead);
router.route('/events/:id/approve').patch(approveEvent);
router.route('/events/:id/reject').patch(rejectEvent);

export default router;
