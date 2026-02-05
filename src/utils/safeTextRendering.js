/**
 * Utility functions for safe text rendering in JSX.
 * Handles escaping of special characters like '>' which cause syntax warnings.
 */

/**
 * Escapes special JSX characters in a string.
 * Specifically targets '>' which can be confused for tag closures.
 * 
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text safe for JSX rendering
 */
export const escapeJSXSpecialChars = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/>/g, '&gt;');
};

/**
 * Renders a breadcrumb path safely.
 * Joins items with the ' > ' separator using HTML entity.
 * 
 * @param {string[]} items - Array of breadcrumb items
 * @returns {React.ReactNode} - Rendered breadcrumb
 */
export const renderBreadcrumb = (items) => {
  if (!Array.isArray(items)) return null;
  return items.join(' \u003E '); // \u003E is unicode for >
};

/**
 * Renders a comparison string safely.
 * Example: "Probability > 80%" -> "Probability &gt; 80%"
 * 
 * @param {string} label - The label text
 * @param {string|number} value - The value being compared
 * @param {string} operator - The operator (default '>')
 * @returns {string} - Safe string
 */
export const renderComparison = (label, value, operator = '>') => {
  const safeOp = operator === '>' ? '\u003E' : operator;
  return `${label} ${safeOp} ${value}`;
};

/**
 * Safely renders a path string.
 * Example: "Root > Engineering > Basic"
 * 
 * @param {string} path - The path string containing '>'
 * @returns {string} - Safe path string
 */
export const renderPath = (path) => {
  if (typeof path !== 'string') return path;
  return path.replace(/\s*>\s*/g, ' \u003E ');
};