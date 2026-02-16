/**
 * In-memory rate limiting for development.
 * NOTE: For production environments with multiple instances (e.g., Vercel, Docker Swarm),
 * you SHOULD use a Redis-backed rate limiter (e.g., @upstash/ratelimit).
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(key) || { count: 0, lastReset: now };

  // Reset counter if window has passed
  if (now - userData.lastReset > windowMs) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(key, userData);
    return true;
  }

  // Check if limit reached
  if (userData.count >= limit) {
    return false;
  }

  userData.count++;
  rateLimitMap.set(key, userData);
  return true;
}
