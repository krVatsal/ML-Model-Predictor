import express from 'express';
import { isVerified } from '../middlewares/auth.js';
import { extractKeywordsAndKaggleApiHit, genResponse, getHistory } from '../controller/groq.controller.js';

const router = express.Router();

// Route for getting dataset recommendations
router.get("/getRecommendation", extractKeywordsAndKaggleApiHit)

// Route for generating response
router.post('/prompt', isVerified, genResponse)
router.get("/history/:userId", isVerified, getHistory)
export default router;