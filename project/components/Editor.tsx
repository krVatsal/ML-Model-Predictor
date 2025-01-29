import React from 'react';
import Editor from "@monaco-editor/react";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const MonacoEditorWithIpynbDownload = ({ code }) => {
  const handleDownload = () => {
    // Create a Jupyter notebook format structure
    const notebookStructure = {
      cells: [
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: code.split('\n')
        }
      ],
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3"
        },
        language_info: {
          codemirror_mode: {
            name: "ipython",
            version: 3
          },
          file_extension: ".py",
          mimetype: "text/x-python",
          name: "python",
          nbconvert_exporter: "python",
          pygments_lexer: "ipython3",
          version: "3.8.0"
        }
      },
      nbformat: 4,
      nbformat_minor: 4
    };

    // Create blob from the notebook structure
    const blob = new Blob([JSON.stringify(notebookStructure, null, 2)], 
      { type: 'application/json' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-notebook.ipynb';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="h-full relative">
      <Button 
        onClick={handleDownload}
        className="absolute top-2 right-2 z-10"
        variant="secondary"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download as Notebook
      </Button>
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
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default MonacoEditorWithIpynbDownload;