import GeminiSocketHandler from '../services/socket.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Store the socket handler instance globally
let socketHandler;

const initSocketHandler = (server) => {
  socketHandler = new GeminiSocketHandler(server);
  return socketHandler;
};

const extractKeywordsAndKaggleApiHit = asyncHandler(async (req, res) => {
  if (!socketHandler) {
    throw new ApiError(500, 'Socket handler not initialized');
  }

  const userPrompt = req.body.prompt;
  if (!userPrompt) {
    throw new ApiError(400, 'Prompt is required');
  }

  // Emit extract-keywords event
  await socketHandler.getIO().emit('extract-keywords', { userPrompt });

  // Listen for the result
  socketHandler.getIO().on('keywords-result', (data) => {
    res.status(200).json(new ApiResponse(200, data, 'Suggested datasets successfully'));
  });

  // Listen for errors
  socketHandler.getIO().on('error', (error) => {
    throw new ApiError(500, `Keyword extraction failed: ${error.message}`);
  });
})

const genResponse = asyncHandler(async (req, res) => {
  if (!socketHandler) {
    throw new ApiError(500, 'Socket handler not initialized');
  }

  const { userPrompt, trainingData } = req.body;

  if (!userPrompt) {
    throw new ApiError(400, 'Prompt is required');
  }

  // Emit generate-response event
  socketHandler.getIO().emit('generate-response', { userPrompt, trainingData });

  // Listen for the result
  socketHandler.getIO().on('generate-response-result', (data) => {
    res.status(200).json(new ApiResponse(200, data, 'Response generated successfully'));
  });

  // Listen for errors
  socketHandler.getIO().on('error', (error) => {
    throw new ApiError(500, `Response generation failed: ${error.message}`);
  });
});

export {
  genResponse,
  extractKeywordsAndKaggleApiHit,
  initSocketHandler,
};
