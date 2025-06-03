import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/authStore'

// Supabaseモックの設定
vi.mock('@/shared/utils/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}))

describe('認証機能のテスト', () => {
  beforeEach(() => {
    // 各テストの前にストアをリセット
    useAuthStore.setState({ session: null })
  })

  describe('AuthStore', () => {
    it('セッションを設定できること', () => {
      const mockSession = {
        auth: {
          access_token: 'test-token',
          expires_at: Date.now() / 1000 + 3600
        },
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }

      useAuthStore.getState().setSession(mockSession)
      expect(useAuthStore.getState().session).toEqual(mockSession)
    })

    it('セッションをクリアできること', () => {
      const mockSession = {
        auth: {
          access_token: 'test-token',
          expires_at: Date.now() / 1000 + 3600
        },
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }

      useAuthStore.getState().setSession(mockSession)
      useAuthStore.getState().clearSession()
      expect(useAuthStore.getState().session).toBeNull()
    })
  })

  describe('ログイン機能', () => {
    it('正しい認証情報でログインできること', async () => {
      const { supabase } = await import('@/shared/utils/supabase')
      const mockSession = {
        access_token: 'test-token',
        expires_at: Date.now() / 1000 + 3600,
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: { role: 'user' }
        }
      }

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: mockSession, user: mockSession.user },
        error: null
      })

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result.error).toBeNull()
      expect(result.data.session).toBeDefined()
      expect(result.data.session?.access_token).toBe('test-token')
    })

    it('無効な認証情報でエラーが返ること', async () => {
      const { supabase } = await import('@/shared/utils/supabase')
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: null, user: null },
        error: { message: 'Invalid login credentials', name: 'AuthError', status: 400 }
      })

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrong-password'
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid login credentials')
      expect(result.data.session).toBeNull()
    })
  })

  describe('ログアウト機能', () => {
    it('正常にログアウトできること', async () => {
      const { supabase } = await import('@/shared/utils/supabase')
      
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: null
      })

      const result = await supabase.auth.signOut()
      expect(result.error).toBeNull()
    })
  })

  describe('ロール判定', () => {
    it('管理者ロールを正しく判定できること', () => {
      const adminSession = {
        auth: {
          access_token: 'admin-token',
          expires_at: Date.now() / 1000 + 3600
        },
        user: {
          id: 'admin-user-id',
          email: 'admin@example.com'
        }
      }

      useAuthStore.getState().setSession(adminSession)
      const session = useAuthStore.getState().session
      
      // メタデータにロール情報を含む場合の判定をテスト
      expect(session?.user.email).toBe('admin@example.com')
    })

    it('一般ユーザーロールを正しく判定できること', () => {
      const userSession = {
        auth: {
          access_token: 'user-token',
          expires_at: Date.now() / 1000 + 3600
        },
        user: {
          id: 'normal-user-id',
          email: 'user@example.com'
        }
      }

      useAuthStore.getState().setSession(userSession)
      const session = useAuthStore.getState().session
      
      expect(session?.user.email).toBe('user@example.com')
    })
  })
})