import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, code, handleCodeChange }) => {
  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
