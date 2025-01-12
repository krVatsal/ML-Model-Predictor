'use client';

import { SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TextArea } from './ui/text-area';

export function PromptForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [trainingData, setTrainingData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate JSON format
    let parsedTrainingData = null;
    if (trainingData.trim()) {
      try {
        parsedTrainingData = JSON.parse(trainingData);
      } catch (err) {
        setError('Training Data must be valid JSON.');
        return;
      }
    }

    // Prepare data to send
    const requestData = {
      prompt,
      ...(parsedTrainingData && { trainingData: parsedTrainingData }),
    };

    console.log('Form Data:', requestData); // Debugging purposes

    try {
      // Send data to your API route
      const response = await fetch('/api/submit-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Response:', result);
        router.push('/generate'); // Navigate to the next page
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || 'Failed to submit data.'}`);
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      setError('An unexpected error occurred. Please try again.');
    }
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
        label=" Sample Training Data (Optional, must be JSON)"
        value={trainingData}
        onChange={(e) => setTrainingData(e.target.value)}
        placeholder="Add valid JSON here..."
        className="h-48"
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Code
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
}
