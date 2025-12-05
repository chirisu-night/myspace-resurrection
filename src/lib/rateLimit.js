import { RateLimiterMemory } from 'rate-limiter-flexible'

// Different rate limiters for different operations
export const rateLimiters = {
  // Strict rate limiting for authentication
  auth: new RateLimiterMemory({
    points: 10, // 10 attempts (balanced for demo/judging)
    duration: 15 * 60, // per 15 minutes
  }),
  
  // Moderate rate limiting for write operations
  write: new RateLimiterMemory({
    points: 30, // 30 requests
    duration: 60, // per minute
  }),
  
  // Lenient rate limiting for read operations
  read: new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per minute
  }),
  
  // Strict rate limiting for message sending
  message: new RateLimiterMemory({
    points: 10, // 10 messages
    duration: 60, // per minute
  }),
}

export async function checkRateLimit(request, limiterType = 'write') {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  const limiter = rateLimiters[limiterType]
  
  try {
    await limiter.consume(ip)
    return { allowed: true }
  } catch (rateLimiterRes) {
    return { 
      allowed: false, 
      retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) || 1 
    }
  }
}
