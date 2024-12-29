import { Router } from "express";
import {
    getLeaderboard, getScore
} from "../controllers/leaderboard.js"; 
import { isVerified } from "../middlewares/auth.js";

const router = Router();
 
router.route("/leaderboard/:huntId", isVerified).get(getLeaderboard); 
router.route("/score/:huntId", isVerified).get(getScore); 


export default router;