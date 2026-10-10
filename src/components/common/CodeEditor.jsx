import React, { useRef, useMemo, useEffect } from 'react';
import { highlightCode } from '../../services/syntaxHighlighter';

/**
 * Production syntax-highlighted code editor with synchronized scrolling,
 * 2-space tab indentation, and colorful syntax token styling.
 */
export function CodeEditor({
  code,
  onChange,
  onRun,
  language = 'jsx',
  placeholder = '// Write your code here...',
  id = 'code-editor-textarea',
  height = '440px',
  minHeight = '440px',
  readOnly = false
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Ensure code is always a string
  const currentCode = code || '';

  // Calculate explicit editor height
  const editorHeight = height || minHeight || '440px';

  // Memoized syntax highlighted HTML
  const highlightedHtml = useMemo(() => {
    // Append a space or newline so trailing newlines render properly in the pre layer
    const formattedCode = currentCode.endsWith('\n') ? currentCode + ' ' : currentCode;
    return highlightCode(formattedCode, language);
  }, [currentCode, language]);

  // Compute line count for line numbers column
  const lineCount = useMemo(() => {
    return Math.max(currentCode.split('\n').length, 16);
  }, [currentCode]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }, [lineCount]);

  // Synchronize scrolling between textarea, highlight layer, and line numbers
  const handleScroll = (e) => {
    const { scrollTop, scrollLeft } = e.target;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Keyboard shortcut & Tab indentation handling
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = currentCode.substring(0, start) + '  ' + currentCode.substring(end);

      onChange(newCode);

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) {
        onRun();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
    }
  };

  // Ensure initial scroll sync
  useEffect(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div
      className="colorful-code-editor"
      style={{ height: editorHeight, minHeight: editorHeight }}
    >
      {/* Line Numbers Column */}
      <div
        className="editor-gutter"
        ref={lineNumbersRef}
        aria-hidden="true"
        style={{ height: '100%', minHeight: editorHeight }}
      >
        {lineNumbers.map((n) => (
          <span key={n} className="line-num">{n}</span>
        ))}
      </div>

      {/* Editor Surface: Highlight Layer + Transparent Textarea */}
      <div
        className="editor-surface"
        style={{ height: '100%', minHeight: editorHeight }}
      >
        {/* Colorful Syntax Highlighting Layer */}
        <pre
          ref={preRef}
          className="editor-highlight-layer language-jsx"
          aria-hidden="true"
        >
          <code
            className="language-jsx"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>

        {/* Interactive Editing Textarea */}
        <textarea
          id={id}
          ref={textareaRef}
          className="editor-input-layer"
          value={currentCode}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
