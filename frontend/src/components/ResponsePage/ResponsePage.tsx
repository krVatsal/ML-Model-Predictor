import React, { useState,useEffect } from 'react';
import { CheckpointList } from '../Checkpoint/CheckpointList';
import { CodeDisplay } from '../CodeDisplay/CodeDisplay';
import { ChatInput } from '../ChatInput/ChatInput';
import type { CheckpointItem } from '../Checkpoint/Checkpoint';
import { useLocation } from 'react-router-dom';
interface ResponsePageProps {
  onContinueConversation: (message: string) => void;
}

export default function ResponsePage({ onContinueConversation }: ResponsePageProps) {
  const location = useLocation();
  const [checkpoints] = useState<CheckpointItem[]>([
    { id: 1, text: 'Analyzing prompt', completed: true },
    { id: 2, text: 'Generating code structure', completed: true },
    { id: 3, text: 'Implementing functionality', completed: false },
    { id: 4, text: 'Optimizing code', completed: false },
  ]);

  const [generatedCode, setGeneratedCode] = useState(`// Generated code will appear here`);
  
 useEffect(() => {
  // Fetch the generated code from the API
  const apiData = location.state.data; // Access the passed data
  setGeneratedCode(apiData.data);
}, []);

  const handleOpenColab = () => {
    const colabUrl = 'https://colab.research.google.com/drive/#create=true';
    window.open(colabUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-73px)]">
      <CheckpointList checkpoints={checkpoints} />
      <div className="flex flex-col h-full">
        <CodeDisplay code={generatedCode} />
        <ChatInput 
          onSendMessage={onContinueConversation}
          onOpenColab={handleOpenColab}
        />
      </div>
    </div>
  );
}