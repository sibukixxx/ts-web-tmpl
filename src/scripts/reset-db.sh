#!/bin/bash

# scripts/reset-db.sh

# 本番環境での誤実行を防ぐためチェック
if [ "$NODE_ENV" = "production" ]; then
  echo "Error: This script cannot be run in production environment."
  exit 1
fi

echo "Resetting database..."
# データベースをリセットし、全てのマイグレーションを再度適用
# --force: ユーザー確認なく強制実行
# --skip-seed: package.json の "prisma": {"seed": ...} を呼ばない
npx prisma migrate reset --force --skip-seed

# migrate reset しただけで最新の schema.prisma 通りになるが、
# 必要に応じて明示的に migrate dev を再度実行する（好みで省略可）
echo "Applying migrations (optional step)..."
npx prisma migrate dev

# 必要に応じて追加のシードデータを投入
echo "Running additional seeds..."
npm run db:seed

echo "Database reset completed!"