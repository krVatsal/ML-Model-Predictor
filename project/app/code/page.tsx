"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import Editor from "@monaco-editor/react"
import { useRouter } from 'next/navigation'
export default function CodePage() {
  const router= useRouter()
  const [trainingData, setTrainingData] = useState('');
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('// Generated code will appear here')
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    if(prompt.trim()==null) return
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
      const response = await fetch('http://localhost:5217/gen/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Navigate to /generate and pass data as query parameters
        router.push(`/code?data=${encodeURIComponent(JSON.stringify(data))}`);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || 'Failed to submit data.'}`);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      try {
        const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;
        setCode(parsedData?.data || '// Generated code will appear here');
      } catch (error) {
        console.error('Error parsing query data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="text-lg font-bold">AI Assistant</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-4 grid grid-rows-[auto,1fr] gap-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Describe the code you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Textarea
            placeholder="Sample Training Data (Optional, must be JSON)"
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          
          <Button onClick={handleSubmit} className="h-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="rounded-lg border overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              readOnly: false,
              wordWrap: 'on'
            }}
          />
        </div>
      </main>
    </div>
  )
}