// utils/tokenHelper.ts
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/backend/lib/supabase'

export const ensureAccessToken = async (): Promise<string | null> => {
  const { session, setSession } = useAuthStore.getState()

  if (!session) return null

  const now = Math.floor(Date.now() / 1000)
  if (session.auth.expires_at > now) {
    // アクセストークンが有効な場合
    return session.auth.access_token
  }

  // アクセストークンの有効期限が切れている場合、再取得
  const { data, error } = await supabase.auth.refreshSession()

  if (error || !data.session) {
    console.error('トークンのリフレッシュに失敗しました。', error)
    setSession(null) // セッションをクリア
    return null
  }

  // 再取得したアクセストークンを保存
  setSession({
    auth: {
      access_token: data.session.access_token,
      expires_at: data.session.expires_at ?? Math.floor(Date.now() / 1000 + 3600),
    },
    user: {
      id: data.session.user.id,
      email: data.session.user.email ?? '',
    },
  })

  return data.session.access_token
}
