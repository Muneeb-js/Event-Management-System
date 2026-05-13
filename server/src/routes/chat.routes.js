import express from 'express';
import { chat } from '../controllers/chat.controller.js';

const router = express.Router();

// Chat is public — no auth required so guests can also ask questions
router.post('/', chat);

export default router;
