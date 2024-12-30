'use client';

import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation';

export function Header() {
  const { navigateStatic, currentRole, updateRole } = useTypeSafeNavigation();

  const handleLogout = () => {
    updateRole('guest');
    navigateStatic('public', 'login');
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => navigateStatic('public', 'home')}
            className="text-gray-700 hover:text-gray-900"
          >
            ホーム
          </button>
          {currentRole !== 'guest' && (
            <>
              <button
                onClick={() => navigateStatic('user', 'profile')}
                className="text-gray-700 hover:text-gray-900"
              >
                プロフィール
              </button>
              <button
                onClick={() => navigateStatic('user', 'dashboard')}
                className="text-gray-700 hover:text-gray-900"
              >
                ダッシュボード
              </button>
            </>
          )}
          {currentRole === 'admin' && (
            <button
              onClick={() => navigateStatic('admin', 'users')}
              className="text-gray-700 hover:text-gray-900"
            >
              ユーザー管理
            </button>
          )}
        </div>
        <div>
          {currentRole === 'guest' ? (
            <div className="space-x-4">
              <button
                onClick={() => navigateStatic('public', 'login')}
                className="text-blue-600 hover:text-blue-800"
              >
                ログイン
              </button>

              <button
                onClick={() => navigateStatic('public', 'register')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                新規登録
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              ログアウト
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}