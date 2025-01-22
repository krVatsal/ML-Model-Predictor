import express from 'express';
import { isVerified } from '../middlewares/auth.js';
import { genResponse,extractKeywordsAndKaggleApiHit } from '../controller/gemini.controller.js';
const router = express.Router();

router.post('/prompt',genResponse,isVerified);
router.get("/getRecommendation", extractKeywordsAndKaggleApiHit, isVerified)


export default router ;