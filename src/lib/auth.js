// Authorization helper functions

export function isAuthorized(requestUserId, resourceUserId) {
  // Check if the requesting user is authorized to access/modify the resource
  return requestUserId === resourceUserId
}

export function validateUserId(userId) {
  // Basic validation for user IDs
  if (!userId || typeof userId !== 'string') {
    return false
  }
  // Check if it's a valid cuid format (starts with 'c')
  return userId.length > 10 && userId.startsWith('c')
}
