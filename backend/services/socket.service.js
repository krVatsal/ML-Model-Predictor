import { Server } from 'socket.io';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPrompt, CONTINUE_PROMPT } from '../utils/prompt.js';
import { displayDatasetOptions } from '../utils/kaggle.js';

class GeminiSocketHandler {
  constructor(server) {
    // Initialize Google Generative AI
    this.genAI = new GoogleGenerativeAI(
process.env.GEMINI_KEY

     );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    // Initialize Socket.IO
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Generate Response Event
      socket.on('generate-response', async (data) => {
        try {
          const { userPrompt, trainingData } = data;
          console.log(data)

          if (!userPrompt) {
            socket.emit('error', {
              message: 'Please provide a prompt',
              type: 'missing-prompt',
            });
            return;
          }

          const keywordPrompt = `
"Extract the most relevant machine learning keyword from the following prompt. Focus on identifying the primary domain of the task, such as finance, healthcare, image classification, climate change, COVID-19, e-commerce, social media, education, recommendation systems, time series, sports, natural language processing (NLP), etc. The keyword should clearly represent the core subject or application area of the model being proposed.

Example Input:
'Create a model to predict house prices based on area and location'

Example Output:
'house prices'

Return only one keyword that best represents the domain of the task."
Here is the prompt:
${data.userPrompt}`;
console.log(keywordPrompt)
          const result = await this.model.generateContent(keywordPrompt);
          const keywords = result.response.candidates[0].content.parts[0].text;
          // console.log(result)
          // console.log(keywords)
          console.log('Keywords:', keywords)
          // Get dataset options
          let datasets = await displayDatasetOptions(keywords);

          let finalTrainingData = trainingData;

          // Use default Kaggle dataset if training data is not provided
          if (!finalTrainingData) {
            console.log('Fetching default Kaggle dataset...');
            const defaultDataset = datasets.data.slice(0, 1);
            if (defaultDataset) {
              finalTrainingData = `Dataset: ${defaultDataset.title}\nURL: ${defaultDataset.url}`;
            } else {
              console.warn('No default Kaggle dataset found.');
            }
          }

          const systemPrompt = getSystemPrompt();
          const continuePrompt = CONTINUE_PROMPT;
          const finalPrompt = finalTrainingData
            ? `${systemPrompt}\n${continuePrompt}\n${userPrompt}\n${finalTrainingData}`
            : `${systemPrompt}\n${continuePrompt}\n${userPrompt}`;

          const code = await this.model.generateContent(finalPrompt);
          const response = code.response.candidates[0].content.parts[0].text;

          // Emit response back to the client
          socket.emit('generate-response-result', {
            response,datasets
          });
        } catch (error) {
          socket.emit('error', {
            message: `Response generation failed: ${error.message}`,
            type: 'response-generation',
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Method to get the Socket.IO instance
  getIO() {
    return this.io;
  }
}

export default GeminiSocketHandler;
