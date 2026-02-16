# Stage 1: Build
FROM node:20-alpine AS build

# Install build dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy configuration files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from build stage
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Explicitly copy Prisma schema and engines for standalone mode
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 80

ENV PORT 80
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
