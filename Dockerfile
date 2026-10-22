FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_SUPABASE_URL=https://lafhpegjexgbjoxdqxxw.supabase.co
ENV VITE_SUPABASE_ANON_KEY=sb_publishable_2H9RF-gipot9S7pre2NPOQ_2KnywGqP

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.cjs"]
