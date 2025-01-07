import 'dotenv/config'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt, CONTINUE_PROMPT } from './utils/prompt.js';
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const genResponse=asyncHandler(async(req,res)=>{
  
  const userPrompt = "Write the code for a ml model to predict if user will buy certain thing or not";
  try {
    const prompt = `${getSystemPrompt}\n${CONTINUE_PROMPT}\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
    return res.status(200).json(new ApiResponse(200, response.text()));
  } catch (error) {
    console.error('Error:', error);
    return new ApiError(500, "Failed to fetch response")
  }
})

export {genResponse}