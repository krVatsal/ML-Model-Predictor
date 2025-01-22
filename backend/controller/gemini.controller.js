import 'dotenv/config'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt, CONTINUE_PROMPT } from '../utils/prompt.js';
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { displayDatasetOptions } from '../utils/kaggle.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const extractKeywordsAndKaggleApiHit =asyncHandler( async (req,res) => {
  try {
    const userPrompt = req.body.userPrompt
    console.log(req.body)
      const keywordPrompt = `
"Extract the most relevant machine learning keyword from the following prompt. Focus on identifying the primary domain of the task, such as finance, healthcare, image classification, climate change, COVID-19, e-commerce, social media, education, recommendation systems, time series, sports, natural language processing (NLP), etc. The keyword should clearly represent the core subject or application area of the model being proposed.

Example Input:
'Create a model to predict house prices based on area and location'

Example Output:
'house prices'

Return only one keyword that best represents the domain of the task."
Here is the prompt , 
      `;
      const prompt = keywordPrompt+ userPrompt
      const result = await model.generateContent(prompt);
      const keywords = await result.response.text();
      await displayDatasetOptions(keywords)
      res.status(200).json(200, "Suggeted datasets successfully")
  } catch (error) {
      throw new Error(`Keyword extraction and recommendation failed: ${error.message}`);
  }
})

const genResponse=asyncHandler(async(req,res)=>{
  console.log("gemini api hit .....");
  //const userPrompt = "Write the code for a ml model to predict if user will buy certain thing or not"
  const userPrompt = req.prompt;
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

export {genResponse,
        extractKeywordsAndKaggleApiHit
  
}