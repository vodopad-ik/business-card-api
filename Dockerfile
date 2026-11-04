# Multi-stage Dockerfile: build -> production

# 1. Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Копируем package-файлы и устанавливаем зависимости
COPY package*.json ./
RUN npm ci || npm install

# Копируем Prisma схему и конфиги
COPY prisma ./prisma/
COPY prisma.config.ts tsconfig*.json nest-cli.json ./

# Генерируем клиент Prisma
RUN npx prisma generate

# Копируем исходный код и компилируем NestJS
COPY src ./src/
RUN npm run build

# Удаляем dev-зависимости для продакшена
RUN npm prune --production

# 2. Production stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем только скомпилированные файлы и prod-зависимости
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./

# Скрипт миграций и сида
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/main.js"]