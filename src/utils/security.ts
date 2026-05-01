/**
 * Security utilities for RedGold.
 */

/**
 * Escapes HTML special characters to prevent XSS.
 * @param str The string to escape.
 * @returns The escaped string.
 */
export function escapeHTML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes a string allowing only safe tags like <b> and <i>.
 * Useful for vocabulary highlighting where <b> is used.
 */
export function sanitizeHTML(str: string): string {
  if (!str) return '';
  // Basic sanitization: escape everything first, then unescape <b>, </b>, <i>, </i>
  const escaped = escapeHTML(str);
  return escaped
    .replace(/&lt;b&gt;/g, '<b>')
    .replace(/&lt;\/b&gt;/g, '</b>')
    .replace(/&lt;i&gt;/g, '<i>')
    .replace(/&lt;\/i&gt;/g, '</i>');
}
