// Secure error handling utility
// Prevents information leakage through error messages

export function handleError(error) {
  // Log full error for debugging (server-side only)
  console.error('API Error:', error)
  
  // Return generic error message to client
  // This prevents exposing database structure, file paths, etc.
  return {
    error: 'An error occurred while processing your request',
    // In development, you can optionally include more details
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  }
}

// Specific error messages for common cases
export function notFoundError(resource = 'Resource') {
  return { error: `${resource} not found` }
}

export function unauthorizedError(message = 'Unauthorized') {
  return { error: message }
}

export function validationError(message) {
  return { error: message }
}
