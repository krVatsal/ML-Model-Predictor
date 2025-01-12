'use client';

import { SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TextArea } from '../ui/text-area';
import { useNavigate } from 'react-router-dom';


export function PromptForm() {
  const router = useRouter();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [trainingData, setTrainingData] = useState('');

  const handleSubmit = async(e: React.FormEvent) => {
    console.log("handleSubmit hit ...");
    e.preventDefault();

    console.log("Prompt:", prompt);
    console.log("Training Data:", trainingData);
    try {
      const response = await fetch('http://localhost/gen/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          trainingData,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      // Navigate to /generate and pass data as state
      navigate('/generate', { state: { data } });
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
    //router.push('/generate');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <TextArea
        id="prompt"
        label="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to create..."
        className="h-32"
      />

      <TextArea
        id="training"
        label="Training Data (Optional)"
        value={trainingData}
        onChange={(e) => setTrainingData(e.target.value)}
        placeholder="Add sample training data here..."
        className="h-48"
      />

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 
                 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Code
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
}