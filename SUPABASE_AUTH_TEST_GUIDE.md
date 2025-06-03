# Supabase Auth テスト手順書

## 概要
このドキュメントでは、Next.jsアプリケーションに導入したSupabase Authの動作確認手順を説明します。

## 前提条件
- Node.js 18以上がインストールされていること
- pnpmがインストールされていること
- Supabaseプロジェクトが作成されていること
- 環境変数が設定されていること

## 環境変数の設定
`.env.local`ファイルに以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## セットアップ手順

1. **依存関係のインストール**
   ```bash
   cd src
   pnpm install
   ```

2. **データベースのセットアップ**
   ```bash
   pnpm db:migrate:dev
   pnpm db:seed
   ```

3. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```

## 機能テスト手順

### 1. ユーザー登録
1. ブラウザで `http://localhost:3000/register` にアクセス
2. 以下の情報を入力：
   - メールアドレス: `test@example.com`
   - パスワード: `password123`（8文字以上）
   - その他必要な情報
3. 「登録」ボタンをクリック
4. 成功すると自動的にログインされ、ホームページにリダイレクトされます

### 2. ログイン
1. ブラウザで `http://localhost:3000/login` にアクセス
2. 登録したメールアドレスとパスワードを入力
3. 「ログイン」ボタンをクリック
4. 成功するとホームページにリダイレクトされます

### 3. ログアウト
1. ログイン状態でヘッダーの「アカウント」メニューをクリック
2. 「ログアウト」を選択
3. ログインページにリダイレクトされます

### 4. ロール制御の確認

#### 一般ユーザーの場合
1. 一般ユーザーでログイン
2. ヘッダーメニューで以下が表示されることを確認：
   - ホーム
   - プロフィール
   - ダッシュボード
3. 管理者メニューが表示されないことを確認

#### 管理者ユーザーの場合
1. 管理者権限のあるユーザーでログイン（Supabaseダッシュボードでuser_metadataにrole: "admin"を設定）
2. ヘッダーメニューで以下が表示されることを確認：
   - ホーム
   - プロフィール
   - ダッシュボード
   - ユーザー管理（管理者のみ）

### 5. 認証状態の永続化
1. ログイン後、ブラウザをリロード
2. ログイン状態が維持されていることを確認
3. ブラウザの開発者ツールで、localStorageに`auth-storage`キーが存在することを確認

### 6. APIエンドポイントの保護

#### 公開エンドポイント
```bash
curl http://localhost:3000/api/public
```
認証なしでアクセス可能

#### 認証が必要なエンドポイント
```bash
# トークンなしでアクセス（401エラーが返る）
curl http://localhost:3000/api/mypage/profile

# トークンありでアクセス（ログイン後、開発者ツールからトークンを取得）
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" http://localhost:3000/api/mypage/profile
```

#### 管理者のみアクセス可能なエンドポイント
```bash
# 一般ユーザーのトークンでアクセス（403エラーが返る）
curl -H "Authorization: Bearer USER_TOKEN" http://localhost:3000/api/private/users

# 管理者トークンでアクセス（正常にレスポンスが返る）
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:3000/api/private/users
```

## 自動テストの実行

### ユニットテスト
```bash
cd src
pnpm test
```

### 特定のテストファイルのみ実行
```bash
pnpm test auth.test.ts
pnpm test auth-middleware.test.ts
```

### テストをウォッチモードで実行
```bash
pnpm test:watch
```

## トラブルシューティング

### ログインできない場合
1. Supabaseダッシュボードでユーザーが作成されているか確認
2. メールアドレスが確認済みになっているか確認（Supabaseの設定による）
3. 環境変数が正しく設定されているか確認

### 403/401エラーが発生する場合
1. トークンの有効期限が切れていないか確認
2. ユーザーのロール設定が正しいか確認
3. APIエンドポイントのミドルウェア設定を確認

### セッションが維持されない場合
1. ブラウザのlocalStorageが有効になっているか確認
2. AuthProviderが正しく設定されているか確認
3. Supabaseクライアントの設定を確認

## 実装済み機能一覧

✅ **実装完了**
- ログインフォーム（メール/パスワード認証）
- ログアウト処理
- ユーザー登録
- 認証状態の永続化（localStorage）
- ロールベースのアクセス制御（user/admin）
- APIエンドポイントの保護
- 認証ミドルウェア
- 自動テスト（Vitest）

🔲 **未実装/今後の拡張**
- パスワードリセット機能
- ソーシャルログイン（Google, GitHub等）
- メールアドレス確認フロー
- 多要素認証（MFA）
- セッションタイムアウト処理
- リフレッシュトークンの自動更新

## 関連ファイル

- **認証関連**
  - `/app/login/page.tsx` - ログインページ
  - `/app/register/page.tsx` - 登録ページ
  - `/components/Navigation/Header.tsx` - ヘッダー（ログアウト含む）
  - `/providers/AuthProvider.tsx` - 認証状態管理Provider
  - `/stores/authStore.ts` - Zustand認証ストア

- **バックエンド**
  - `/backend/lib/auth/supabaseAuth.ts` - 認証ミドルウェア
  - `/backend/hono/` - API設定（public/private/mypage）

- **テスト**
  - `/tests/auth.test.ts` - 認証機能のユニットテスト
  - `/tests/auth-middleware.test.ts` - ミドルウェアのテスト

## まとめ
このテスト手順書に従って、Supabase Authの各機能が正しく動作することを確認してください。問題が発生した場合は、トラブルシューティングセクションを参照し、それでも解決しない場合は開発チームに連絡してください。