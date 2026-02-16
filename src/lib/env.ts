import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

// If it's not a build phase, log more details if there's an issue
if (!_env.success && process.env.NODE_ENV === "development") {
  console.warn("⚠️ Local environment variables validation issues:", JSON.stringify(_env.error.format(), null, 2));
}

// Map the parsed result or use a fallback. We use an object to allow property access.
const baseEnv = _env.success ? _env.data : {} as any;

/**
 * Validated environment variables with fallback to process.env.
 * This ensures that during build (when Next.js might not load everything identically) 
 * or production, variables can still be retrieved directly from the system environment.
 */
export const env = new Proxy(baseEnv, {
  get(target, prop: string) {
    // If the Zod-validated object has the value, use it.
    if (target[prop] !== undefined) return target[prop];
    
    // Fallback to direct process.env access.
    const rawValue = process.env[prop];
    
    // Safety check for critical variables during actual runtime (not build time).
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "production";
    
    if (!isBuildPhase && !rawValue) {
      if (prop === "DATABASE_URL" || prop === "AUTH_SECRET") {
        throw new Error(`❌ Mandatory environment variable ${prop} is missing or invalid!`);
      }
    }
    
    return rawValue;
  }
}) as z.infer<typeof envSchema> & { [key: string]: string | undefined };
