# scripts/reset-db.sh
#!/bin/bash

# DBをリセットしてマイグレーションを適用
echo "Resetting database..."
npx prisma migrate reset --force

# 必要に応じて追加のシードデータを投入
echo "Running additional seeds..."
npm run db:seed

echo "Database reset completed!"