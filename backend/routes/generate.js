import express from 'express';
import { isVerified } from '../middlewares/auth.js';
import { extractKeywordsAndKaggleApiHit, genResponse } from '../controller/gemini.controller.js';

const router = express.Router();

// Route for getting dataset recommendations
router.get("/getRecommendation", extractKeywordsAndKaggleApiHit);

// Route for generating response
router.post('/prompt', isVerified, genResponse);

export default router;