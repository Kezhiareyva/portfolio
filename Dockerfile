# Based on the Next.js with-docker example; needs output: 'standalone'.

FROM node:22.23.4-alpine AS base

FROM base AS deps
# Some native modules need glibc compat on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache and uploads have to be writable by the nextjs user.
RUN mkdir .next media
RUN chown nextjs:nodejs .next media

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# server.js comes from the standalone build output.
CMD ["node", "server.js"]
