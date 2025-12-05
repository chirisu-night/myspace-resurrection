// Server-side HTML sanitization utility
// This prevents XSS attacks from user-generated HTML content
// Using simple regex-based sanitization for serverless compatibility

export function sanitizeHTML(html) {
  if (!html) return ''
  
  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol
  clean = clean.replace(/javascript:/gi, '')
  
  // Remove data: protocol (can be used for XSS)
  clean = clean.replace(/data:text\/html/gi, '')
  
  // Remove iframe, object, embed tags
  clean = clean.replace(/<(iframe|object|embed|applet)[^>]*>.*?<\/\1>/gi, '')
  
  // Remove style tags with javascript
  clean = clean.replace(/<style[^>]*>[\s\S]*?expression\s*\([\s\S]*?<\/style>/gi, '')
  
  // Limit length
  clean = clean.substring(0, 50000)
  
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
