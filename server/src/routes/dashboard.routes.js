import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getDashboardData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/').get(getDashboardData);

export default router;
