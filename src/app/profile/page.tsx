'use client'

import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import { useEffect } from 'react'

export default function Profile() {
  const { currentRole, navigateStatic } = useTypeSafeNavigation()

  // 認証されていないユーザーをリダイレクト
  useEffect(() => {
    if (currentRole === 'guest') {
      navigateStatic('public', 'login')
    }
  }, [currentRole, navigateStatic])

  // if (currentRole === 'guest') return null;

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
          <div className="space-y-4">
            <p>
              ロール: <span className="font-medium">{currentRole}</span>
            </p>
            {/* 他のプロフィール情報 */}
          </div>
        </div>
      </main>
    </div>
  )
}
