# ---- 1. ベースイメージ ----
FROM node:20-alpine AS builder

# 作業ディレクトリの作成
WORKDIR /app

# 依存ファイルをコピー
COPY package.json pnpm-lock.yaml ./

# pnpm インストール（既にグローバルに入っている場合は省略可）
RUN npm install -g pnpm

# 依存関係をインストール
RUN pnpm install

# アプリの全ソースをコピー
COPY . .

# Next.js の本番ビルド
RUN pnpm build

# ---- 2. ランタイムイメージ ----
FROM node:20-alpine AS runner

WORKDIR /app

# builder ステージから必要なファイルをコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next
# Hono のエントリポイントや config がある場合、必要に応じてコピー
COPY --from=builder /app/hono.config.js ./hono.config.js

# Cloud Run ではポートは 8080 を使うのが一般的
ENV PORT 8080

# 本番起動コマンド
# Next.js は -p オプションでポート指定可能
CMD ["pnpm", "start", "--", "-p", "8080"]
