import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Hono } from 'hono'
import { checkAuth, requireLogin, requireAdmin } from '@/backend/lib/auth/supabaseAuth'

// Supabaseモックの設定
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn()
    }
  }))
}))

// 環境変数のモック
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-key')

describe('認証ミドルウェアのテスト', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    vi.clearAllMocks()
  })

  describe('checkAuth ミドルウェア', () => {
    it('有効なトークンでユーザー情報をセットすること', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockSupabase = createClient('', '')
      
      vi.mocked(mockSupabase.auth.getUser).mockResolvedValueOnce({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: { role: 'user' }
          }
        },
        error: null
      })

      app.use('*', checkAuth)
      app.get('/test', (c) => {
        const user = c.get('user')
        return c.json({ user })
      })

      const res = await app.request('/test', {
        headers: {
          Authorization: 'Bearer valid-token'
        }
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user).toMatchObject({
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      })
    })

    it('無効なトークンでユーザーをnullにセットすること', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockSupabase = createClient('', '')
      
      vi.mocked(mockSupabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid token', name: 'AuthError', status: 401 }
      })

      app.use('*', checkAuth)
      app.get('/test', (c) => {
        const user = c.get('user')
        return c.json({ user })
      })

      const res = await app.request('/test', {
        headers: {
          Authorization: 'Bearer invalid-token'
        }
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user).toBeNull()
    })

    it('トークンなしでユーザーをnullにセットすること', async () => {
      app.use('*', checkAuth)
      app.get('/test', (c) => {
        const user = c.get('user')
        return c.json({ user })
      })

      const res = await app.request('/test')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user).toBeNull()
    })
  })

  describe('requireLogin ミドルウェア', () => {
    it('ログイン済みユーザーはアクセスできること', async () => {
      app.use('*', (c, next) => {
        c.set('user', {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'user'
        })
        return next()
      })
      app.use('*', requireLogin)
      app.get('/protected', (c) => c.json({ message: 'Protected content' }))

      const res = await app.request('/protected')
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.message).toBe('Protected content')
    })

    it('未ログインユーザーは401エラーになること', async () => {
      app.use('*', (c, next) => {
        c.set('user', null)
        return next()
      })
      app.use('*', requireLogin)
      app.get('/protected', (c) => c.json({ message: 'Protected content' }))

      const res = await app.request('/protected')
      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('requireAdmin ミドルウェア', () => {
    it('管理者ユーザーはアクセスできること', async () => {
      app.use('*', (c, next) => {
        c.set('user', {
          id: 'admin-user-id',
          email: 'admin@example.com',
          role: 'admin'
        })
        return next()
      })
      app.use('*', requireAdmin)
      app.get('/admin', (c) => c.json({ message: 'Admin content' }))

      const res = await app.request('/admin')
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.message).toBe('Admin content')
    })

    it('一般ユーザーは403エラーになること', async () => {
      app.use('*', (c, next) => {
        c.set('user', {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'user'
        })
        return next()
      })
      app.use('*', requireAdmin)
      app.get('/admin', (c) => c.json({ message: 'Admin content' }))

      const res = await app.request('/admin')
      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data.error).toBe('Forbidden')
    })

    it('未ログインユーザーは401エラーになること', async () => {
      app.use('*', (c, next) => {
        c.set('user', null)
        return next()
      })
      app.use('*', requireAdmin)
      app.get('/admin', (c) => c.json({ message: 'Admin content' }))

      const res = await app.request('/admin')
      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toBe('Unauthorized')
    })
  })
})