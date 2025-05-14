import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaCopy } from 'react-icons/fa';

const CodeEditor = ({ code, language }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="code-editor">
      <div className="code-editor-header">
        <span className="language-badge">{language || 'javascript'}</span>
        <button className="btn-icon" onClick={copyToClipboard}>
          <FaCopy />
        </button>
      </div>
      <SyntaxHighlighter 
        language={language || 'javascript'} 
        style={atomOneDark}
        className="code-block"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeEditor;