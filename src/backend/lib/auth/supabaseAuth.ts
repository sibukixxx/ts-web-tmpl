import type { MiddlewareHandler } from 'hono'

/**
 * ログインしているかどうかをチェックし、Context に user をセット
 * 非ログインなら c.set('user', null) などにする
 * 実装例: supabaseAuthMiddleware
 */
export const checkAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    // トークンなし→ログインしていない扱い
    c.set('user', null)
    await next()
    return
  }
  // トークン検証 (例: supabase.auth.getUser(token)) …
  // 成功→ c.set('user', userObj)
  // 失敗→ c.set('user', null)
  // → next()
}

/**
 * ログインユーザーのみ許可するミドルウェア
 * ログインしてなければ 404 or リダイレクト (場合に応じて実装)
 */
export const requireLogin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') // checkAuth の後に読む
  if (!user) {
    // 非ログインなら 404 とかリダイレクト
    // 今回は 404 としてみる
    return c.text('Not Found', 404)
  }
  await next()
}

/**
 * admin 権限ユーザーのみ許可
 */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user')
  if (!user || user.role !== 'admin') {
    return c.text('Forbidden', 403)
  }
  await next()
}