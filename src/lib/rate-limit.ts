const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(key) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 1;
    userData.lastReset = now;
    rateLimitMap.set(key, userData);
    return true;
  }

  if (userData.count >= limit) {
    return false;
  }

  userData.count++;
  rateLimitMap.set(key, userData);
  return true;
}
