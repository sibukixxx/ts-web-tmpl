import type { MiddlewareHandler } from 'hono'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// サービスロールキーを使用してトークンを検証
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ユーザー型の定義
interface AuthUser {
  id: string
  email: string
  role?: string
}

/**
 * ログインしているかどうかをチェックし、Context に user をセット
 * 非ログインなら c.set('user', null) などにする
 * 実装例: supabaseAuthMiddleware
 */
export const checkAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // トークンなしまたは不正な形式
    c.set('user', null)
    await next()
    return
  }

  const token = authHeader.substring(7) // 'Bearer ' を除去

  try {
    // Supabaseでトークンを検証
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      c.set('user', null)
      await next()
      return
    }

    // ユーザー情報をContextにセット
    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'user'
    }
    
    c.set('user', authUser)
  } catch (error) {
    console.error('Auth middleware error:', error)
    c.set('user', null)
  }

  await next()
}

/**
 * ログインユーザーのみ許可するミドルウェア
 * ログインしてなければ 404 or リダイレクト (場合に応じて実装)
 */
export const requireLogin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as AuthUser | null
  
  if (!user) {
    // 非ログインの場合は401エラーを返す
    return c.json({ error: 'Unauthorized', message: 'ログインが必要です' }, 401)
  }
  
  await next()
}

/**
 * admin 権限ユーザーのみ許可
 */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as AuthUser | null
  
  if (!user) {
    return c.json({ error: 'Unauthorized', message: 'ログインが必要です' }, 401)
  }
  
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden', message: '管理者権限が必要です' }, 403)
  }
  
  await next()
}
