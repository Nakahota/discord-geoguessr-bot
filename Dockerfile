FROM node:24-alpine AS builder

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# Prisma schema/configをコピー
COPY prisma ./prisma
COPY prisma.config.ts ./

# Prisma Clientを生成
RUN npx prisma generate

# TypeScriptのソースコードをコピー
COPY src ./src
COPY tsconfig.json ./

# TypeScriptをビルド
RUN npm run build


FROM node:24-alpine AS runner

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 本番用依存関係だけインストール
RUN npm ci --omit=dev

# Prisma関連ファイルをコピー
COPY prisma ./prisma
COPY prisma.config.ts ./

# Prisma Clientを生成
RUN npx prisma generate

# ビルド済みJavaScriptをコピー
COPY --from=builder /app/dist ./dist

# Bot起動
CMD ["node", "dist/index.js"]
