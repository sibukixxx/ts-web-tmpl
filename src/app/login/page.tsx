'use client'

import React, { useState } from 'react'
import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import { supabase } from '@/backend/lib/supabase'
import {useAuthStore} from "@/stores/authStore";

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

      //todo サーバー側が Set-Cookie: HttpOnly で refresh_token を付与。
      //todo サーバーが Cookie 内の refresh_token を利用して新たにアクセストークンを発行し、フロントに返す。
      //todo サーバー側で refresh_token を無効化（DB削除など）し、Cookie を破棄 (Set-Cookie: refresh_token=; Max-Age=0 等)。

      // ここでロールを更新する処理（例として admin ユーザーかどうかを判定）
      if (email.includes('admin')) {
        updateRole('admin')
      } else {
        updateRole('user')
      }

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
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  required
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
          </div>
        </div>
      </main>
    </div>
  )
}
