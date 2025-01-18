'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckpointList } from './Checkpoint/CheckpointList';
import { CodeDisplay } from './CodeDisplay/CodeDisplay';
import { ChatInput } from './ChatInput/ChatInput';
import type { CheckpointItem } from './Checkpoint/Checkpoint';

function onContinueConversation() {
  // Define conversation continuation logic here
}

export default function ResponsePage() {
  const router = useRouter(); // Use Next.js router
  const [checkpoints] = useState<CheckpointItem[]>([
    { id: 1, text: 'Analyzing prompt', completed: true },
    { id: 2, text: 'Generating code structure', completed: true },
    { id: 3, text: 'Implementing functionality', completed: false },
    { id: 4, text: 'Optimizing code', completed: false },
  ]);

  const [generatedCode, setGeneratedCode] = useState(`// Generated code will appear here`);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      try {
        const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;
        setGeneratedCode(parsedData?.data || '// Default generated code');
      } catch (error) {
        console.error('Error parsing query data:', error);
      }
    }
  }, []);

  const handleOpenColab = () => {
    if (typeof window !== 'undefined') {
      const colabUrl = 'https://colab.research.google.com/drive/#create=true';
      window.open(colabUrl, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-73px)]">
      <div>
      <CheckpointList checkpoints={checkpoints} />
      <ChatInput 
          onSendMessage={onContinueConversation}
          onOpenColab={handleOpenColab}
        />
        </div>
      <div className="flex flex-col h-full">
        <CodeDisplay code={generatedCode} />

      </div>
    </div>
  );
}
