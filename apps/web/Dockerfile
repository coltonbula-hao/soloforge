FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared ./packages/shared/

RUN npm ci

RUN npm run build --workspace=@soloforge/shared

COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/web
RUN node ./node_modules/next/dist/bin/next build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
