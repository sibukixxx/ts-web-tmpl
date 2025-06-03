'use client'

import { useEffect } from 'react'
import { supabase } from '@/shared/utils/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const { updateRole } = useTypeSafeNavigation()

  useEffect(() => {
    // 初回マウント時に現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession({
          auth: {
            access_token: session.access_token,
            expires_at: session.expires_at ?? Math.floor(Date.now() / 1000 + 3600),
          },
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
          },
        })
        
        // ロールを更新
        const userRole = session.user.user_metadata?.role || 'user'
        updateRole(userRole === 'admin' ? 'admin' : 'user')
      } else {
        clearSession()
        updateRole('guest')
      }
    })

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession({
          auth: {
            access_token: session.access_token,
            expires_at: session.expires_at ?? Math.floor(Date.now() / 1000 + 3600),
          },
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
          },
        })
        
        // ロールを更新
        const userRole = session.user.user_metadata?.role || 'user'
        updateRole(userRole === 'admin' ? 'admin' : 'user')
      } else {
        clearSession()
        updateRole('guest')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, clearSession, updateRole])

  return <>{children}</>
}