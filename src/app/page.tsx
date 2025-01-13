'use client'

import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import { Header } from '@/components/Navigation/Header'
import { useAuthStore } from '@/stores/authStore'

export default function Home() {
  const { currentRole } = useTypeSafeNavigation()
  const { session, clearSession } = useAuthStore.getState()
  const now = Math.floor(Date.now() / 1000)
  if (session && session.auth.expires_at < now) {
    clearSession() // 期限切れなので破棄
  }

  const isLoggedIn = !!session // session が null でなければ true

  return (
    <div>
      <Header currentRole={'admin'} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">ホーム</h1>

        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">
            現在のロール: <span className="font-semibold">{currentRole}</span>
          </p>
          <p>このページはすべてのユーザーがアクセスできます。</p>
          {isLoggedIn ? (
            <p className="text-green-600 font-semibold">
              ログイン済みです。メールアドレス: {session.user.email}
            </p>
          ) : (
            <p className="text-red-600 font-semibold">未ログインです。</p>
          )}
        </div>
      </main>
    </div>
  )
}
