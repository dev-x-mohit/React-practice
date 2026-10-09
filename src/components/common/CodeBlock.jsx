import React, { useMemo } from 'react';
import { highlightCode } from '../../services/syntaxHighlighter';

/**
 * Read-only syntax-highlighted code block with optional line numbers and language tag.
 */
export function CodeBlock({ code, language = 'jsx', className = '' }) {
  const highlightedHtml = useMemo(() => {
    return highlightCode(code || '', language);
  }, [code, language]);

  return (
    <pre className={`code-block language-${language} ${className}`}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </pre>
  );
}
