"use client"
import React from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
interface CodeDisplayProps {
  code: string;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  return (
    <div className="flex-1 p-6 bg-gray-950 overflow-auto">
      <pre className="bg-gray[950] p-6 rounded-lg shadow">
      <Editor height="90vh" defaultLanguage="Python" theme="vs-dark" defaultValue="// some comment" value={code} />
      </pre>
    </div>
  );
}