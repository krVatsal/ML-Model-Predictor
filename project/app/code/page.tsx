"use client"
import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Link from 'next/link'
import { Bot, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import Editor from "@monaco-editor/react"

export default function CodePage() {
  const [socket, setSocket] = useState<any>(null);
  const [trainingData, setTrainingData] = useState('');
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('// Generated code will appear here')
  const [datasets, setDatasets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:5217', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('generate-response-result', (data) => {
      console.log("1")
      setCode(data.response);
      setDatasets(data.datasets || []);
    });

    newSocket.on('error', (errorData) => {
      setError(`Socket Error: ${errorData.message}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    if(!prompt.trim()) return;
    e.preventDefault();
    setError('');

    // Validate JSON format for training data
    let parsedTrainingData = null;
    if (trainingData.trim()) {
      try {
        parsedTrainingData = JSON.parse(trainingData);
      } catch (err) {
        setError('Training Data must be valid JSON.');
        return;
      }
    }

    // Emit socket event
    socket.emit('generate-response', {
      userPrompt: prompt,
      trainingData: parsedTrainingData
    });
  };

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
        
        {datasets.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Suggested Datasets:</h3>
            <div className="grid grid-cols-3 gap-2">
              {datasets.map((dataset: any, index) => (
                <a 
                  key={index} 
                  href={dataset.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-muted p-2 rounded hover:bg-muted/80 transition-colors"
                >
                  {dataset.title}
                </a>
              ))}
            </div>
          </div>
        )}

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