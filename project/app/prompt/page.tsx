"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    const newMessages = [
      ...messages,
      { role: 'user', content: prompt },
      { role: 'assistant', content: 'This is a demo response. In a real implementation, this would be connected to an AI model.' }
    ]
    setMessages(newMessages)
    setPrompt('')
  }

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

      <main className="flex-1 container px-4 py-4 flex flex-col">
        <ScrollArea className="flex-1 rounded-lg border p-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-muted mr-12'
              }`}
            >
              {message.content}
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <Button onClick={handleSubmit} className="h-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}