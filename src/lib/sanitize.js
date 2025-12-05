// Server-side HTML sanitization utility
// This prevents XSS attacks from user-generated HTML content

import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(html) {
  if (!html) return ''
  
  // Use DOMPurify with strict configuration
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'div', 'span',
      'strong', 'em', 'u', 'i', 'b',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'blockquote', 'pre', 'code'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    FORCE_BODY: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
  })
  
  return clean
}

export function sanitizeText(text) {
  if (!text) return ''
  
  // Basic text sanitization - remove any HTML tags
  return text.replace(/<[^>]*>/g, '')
}

export function sanitizeCSS(css) {
  if (!css) return ''
  
  // Remove dangerous CSS properties and values
  let sanitized = css
    // Remove @import (can load external resources)
    .replace(/@import\s+[^;]+;/gi, '')
    // Remove expression() (IE-specific, can execute JS)
    .replace(/expression\s*\([^)]*\)/gi, '')
    // Remove javascript: protocol
    .replace(/javascript\s*:/gi, '')
    // Remove behavior property (IE-specific, can execute code)
    .replace(/behavior\s*:[^;]+;/gi, '')
    // Remove -moz-binding (Firefox-specific, can execute code)
    .replace(/-moz-binding\s*:[^;]+;/gi, '')
    // Limit to reasonable length
    .substring(0, 10000)
  
  return sanitized
}
