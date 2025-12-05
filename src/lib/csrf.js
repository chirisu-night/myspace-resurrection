import { randomBytes } from 'crypto'

// Generate CSRF token
export function generateCSRFToken() {
  return randomBytes(32).toString('hex')
}

// Verify CSRF token
export function verifyCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) return false
  return token === sessionToken
}

// Middleware to check CSRF token on state-changing operations
export function checkCSRF(request) {
  const method = request.method
  
  // Only check CSRF for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = request.headers.get('x-csrf-token')
    const sessionCSRF = request.cookies.get('csrf-token')?.value
    
    if (!csrfToken || !sessionCSRF || csrfToken !== sessionCSRF) {
      return false
    }
  }
  
  return true
}
