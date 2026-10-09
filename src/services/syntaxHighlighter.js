import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-json.js';

/**
 * Highlights a string of source code with PrismJS tokenization.
 * Fallback to safe escaped HTML on any error.
 *
 * @param {string} code Source code string
 * @param {string} language Language identifier ('jsx', 'javascript', 'json')
 * @returns {string} HTML markup with syntax highlight token spans
 */
export function highlightCode(code, language = 'jsx') {
  if (!code && code !== '') return '';
  const langKey = language.toLowerCase();
  const grammar = Prism.languages[langKey] || Prism.languages.jsx || Prism.languages.javascript;
  
  try {
    return Prism.highlight(code, grammar, langKey);
  } catch (_e) {
    return String(code)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export { Prism };
