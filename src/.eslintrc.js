// 例: .eslintrc.js
module.exports = {
  root: true,
  // ESLint がどの環境で動くか（Node.js,ブラウザなど）
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'], // プロジェクトのtsconfig
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // ← Prettier連携
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // 独自に追加したいルールがあればここに書く
    // 例: 'semi': ['error', 'never']
  },
}
