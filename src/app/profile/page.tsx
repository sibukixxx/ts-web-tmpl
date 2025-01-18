'use client'

import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import React, { useEffect, useState } from 'react'

// プロフィール用の型（受け取るAPIのユーザー情報を定義）
type UserProfile = {
  id: number
  name: string | null
  email: string
  bio: string | null
  avatarUrl: string | null
}

export default function Profile() {
  const { currentRole, navigateStatic } = useTypeSafeNavigation()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証されていないユーザーをリダイレクト
  useEffect(() => {
    if (currentRole === 'guest') {
      navigateStatic('public', 'login')
    }
  }, [currentRole, navigateStatic])

  // ユーザープロフィールを取得
  useEffect(() => {
    if (currentRole !== 'guest') {
      fetchUserProfile()
    }
  }, [currentRole])

  async function fetchUserProfile() {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch('/api/user', { method: 'GET' })
      if (!res.ok) {
        throw new Error('Failed to fetch user')
      }

      const data = await res.json()
      setUser(data.user)
    } catch (err: any) {
      setError(err.message)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // フォーム送信 (プロフィール更新)
  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user')
      }

      const data = await res.json()
      setUser(data.user) // 更新結果を反映
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentRole === 'guest') {
    // ログイン画面へリダイレクト中
    return null
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">プロフィール</h1>

        {isLoading && <p className="text-blue-500 mb-4">読み込み中 / 更新中...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {user ? (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">ユーザーID</label>
                <p className="mt-1 text-gray-700">{user.id}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">メールアドレス</label>
                <p className="mt-1 text-gray-700">{user.email}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">名前</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  value={user.name ?? ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">自己紹介</label>
                <textarea
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  value={user.bio ?? ''}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">アバターURL</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  value={user.avatarUrl ?? ''}
                  onChange={(e) => setUser({ ...user, avatarUrl: e.target.value })}
                />
              </div>
              <p className="mt-4">
                ロール: <span className="font-medium">{currentRole}</span>
              </p>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                プロフィールを更新
              </button>
            </form>
          </div>
        ) : (
          <p>ユーザー情報を取得できませんでした。</p>
        )}
      </main>
    </div>
  )
}
