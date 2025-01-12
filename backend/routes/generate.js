import express from 'express';
import passport from '../middlewares/passport-config.js'; // Path to your configured passport file
import { isVerified } from '../middlewares/auth.js';
import { genResponse } from '../controller/gemini.controller.js';
const router = express.Router();

router.post('/prompt',genResponse);

export default router ;