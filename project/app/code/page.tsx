"use client"
import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import Link from 'next/link'
import { Bot, Send,User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import Editor from "@monaco-editor/react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  trainingData?: string
}
export default function CodePage() {
  const [socket, setSocket] = useState<any>(null);
  const [trainingData, setTrainingData] = useState('');
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('// Generated code will appear here')
  const [displayedCode, setDisplayedCode] = useState('// Generated code will appear here')
  const [steps, setSteps] = useState<Array<{title: string, description: string}>>([]);
  const [displayedSteps, setDisplayedSteps] = useState<Array<{title: string, description: string}>>([]);
  const [datasets, setDatasets] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  const typewriterRef = useRef<any>(null);

  const typewriterEffect = async (text: string, setter: (text: string) => void, speed = 2) => {
    setIsLoading(true)
    let currentText = '';
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setter(currentText);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    setIsLoading(false)
  };

  const typewriterStepsEffect = async (steps: Array<{title: string, description: string}>, speed = 10) => {
    const displaySteps: Array<{title: string, description: string}> = [];
    
    for (const step of steps) {
      displaySteps.push({ title: '', description: '' });
      setDisplayedSteps([...displaySteps]);
      
      // Type the title
      let currentTitle = '';
      for (let i = 0; i < step.title.length; i++) {
        currentTitle += step.title[i];
        displaySteps[displaySteps.length - 1].title = currentTitle;
        setDisplayedSteps([...displaySteps]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      // Type the description
      let currentDesc = '';
      for (let i = 0; i < step.description.length; i++) {
        currentDesc += step.description[i];
        displaySteps[displaySteps.length - 1].description = currentDesc;
        setDisplayedSteps([...displaySteps]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
    setIsLoading(true)
  };

  useEffect(() => {
    const newSocket = io('http://localhost:5217', {
      transports: ['websocket']
    });
  
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });
  
    newSocket.on('generate-response-chunk', (data) => {
      parseGeminiResponse(data.progress, true);
      console.log(data.progress);
    })
  
    newSocket.on('generate-response-result', (data) => {
      console.log(data);
      setIsLoading(false);
      parseGeminiResponse(data.response, false);
      if (data.datasets?.data) {
        setDatasets(data.datasets.data);
      }
    });
  
    newSocket.on('error', (errorData) => {
      setIsLoading(false);
      setError(`Socket Error: ${errorData.message}`);
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const parseGeminiResponse = async (response: string, isStreaming: boolean) => {
    try {
      // Clear any existing typewriter timeouts
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }

      // Extract content between <ChanetTags> tags
      const tagsMatch = response.match(/<ChanetTags>([\s\S]*?)<\/ChanetTags>/);
      if (tagsMatch) {
        const tags = tagsMatch[1].trim().split('\n').map(tag => {
          const [title, ...descParts] = tag.trim().split(':');
          return {
            title: title.replace(/^\d+\.\s*/, '').trim(),
            description: descParts.join(':').trim()
          };
        });
        setSteps(tags);
        if (!isStreaming) {
          typewriterStepsEffect(tags);
        }
      }

      // Extract content between <code> tags
      const codeMatch = response.match(/<code>([\s\S]*?)<\/code>/);
      if (codeMatch) {
        const newCode = codeMatch[1].trim();
        setCode(newCode);
        if (!isStreaming) {
          typewriterEffect(newCode, setDisplayedCode);
          setChatMessages(prev => [
            ...prev,
            {
              type: 'assistant',
              content: "Let me help you with that...",
            }
          ]);
        }
      }

      setInitiated(true);
    } catch (err) {
      console.error('Error parsing Gemini response:', err);
      setError('Error parsing the response');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if(!prompt.trim()) return;
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setInitiated(true);
    setDisplayedSteps([]);
    setDisplayedCode('');
    setDatasets([]);
    setChatMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: prompt,
        trainingData: trainingData.trim() || undefined
      }
    ]);
    
    let parsedTrainingData = null;
    if (trainingData.trim()) {
      try {
        parsedTrainingData = JSON.parse(trainingData);
      } catch (err) {
        setError('Training Data must be valid JSON.');
        return;
      }
    }
    setPrompt('')
    setTrainingData('')
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

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <main className={`flex-1 container px-4 py-4 grid grid-rows-[auto,1fr] gap-4 transition-all duration-300 ease-in-out ${initiated ? 'w-[65%]' : 'w-full'}`}>
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe the code you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
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
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              onClick={handleSubmit} 
              className="h-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader h-4 w-4 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && <p className="text-red-600">{error}</p>}

          <div className="h-full rounded-lg border overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={displayedCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                readOnly: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </main>

       <div 
          className={`transition-all duration-300 ease-in-out flex flex-col ${
            initiated ? 'w-[35%] opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    <span className="font-medium">
                      {message.type === 'user' ? 'You' : 'Assistant'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  {message.trainingData && (
                    <div className="mt-2 text-xs bg-background/10 p-2 rounded">
                      <div className="font-medium">Training Data:</div>
                      <pre className="whitespace-pre-wrap">{message.trainingData}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {displayedSteps.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-4">Implementation Steps</h3>
                <div className="flex flex-col gap-4">
                  {displayedSteps.map((step, index) => (
                    <div key={index} className="rounded-lg border p-4 bg-muted/30">
                      <h4 className="font-medium text-primary mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

{datasets.length == 0 && isLoading ? (
              <div className="loader h-4 w-4 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
            ): (
              <div>
              <h3 className="text-lg font-semibold mb-4">Recommended Datasets</h3>
              <div className="flex flex-col gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}