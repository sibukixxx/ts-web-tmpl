'use client'

import React, { useState } from 'react'
import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import { supabase } from '@/shared/utils/supabase'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const { updateRole, navigateStatic } = useTypeSafeNavigation()
  const setSession = useAuthStore((state) => state.setSession)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Supabase を使って認証を行う
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // サーバーからのエラーが返ってきた場合
        throw new Error(error.message)
      }
      if (!data.session) {
        // セッションが得られない場合はエラーとする
        throw new Error('セッションの取得に失敗しました。')
      }

      setSession({
        auth: {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at ?? Math.floor(Date.now() / 1000 + 3600), // 有効期限（デフォルト1時間）
        },
        user: {
          id: data.session.user.id,
          email: data.session.user.email ?? '',
        },
      })

      // ユーザーのロールを取得（メタデータまたはカスタムクレームから）
      const userRole = data.session.user.user_metadata?.role || 'user'
      updateRole(userRole === 'admin' ? 'admin' : 'user')

      // ログイン成功時にリダイレクト
      navigateStatic('public', 'home')
    } catch (err: any) {
      console.error('ログインエラー:', err)
      setErrorMessage(err.message ?? 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              アカウントにログイン
            </h2>

            {/* コメントアウトを外したフォーム部分 */}
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-center">
                  <button
                    onClick={() => navigateStatic('public', 'register')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    新規アカウントを作成
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {/* TODO: パスワードリセット機能 */}}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    パスワードをお忘れですか？
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
