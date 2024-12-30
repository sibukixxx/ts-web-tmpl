'use client';

import React, { useState } from 'react';
import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation';

export default function Login() {
  const { updateRole, navigateStatic } = useTypeSafeNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ここで実際の認証処理を行う
    // 例としてemail によってロールを変更
    if (email.includes('admin')) {
      updateRole('admin');
    } else {
      updateRole('user');
    }

    navigateStatic('public', 'home');
  };

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">ログイン</h1>
          <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              ログイン
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}