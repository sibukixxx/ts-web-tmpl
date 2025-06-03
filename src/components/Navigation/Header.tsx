'use client'

import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { supabase } from '@/shared/utils/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  currentRole: 'guest' | 'user' | 'admin'
}

export function Header({}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { navigateStatic, currentRole, updateRole } = useTypeSafeNavigation()

  const clearSession = useAuthStore((state) => state.clearSession)

  const handleLogout = async () => {
    try {
      // Supabaseからログアウト
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // ローカルストアのセッションをクリア
      clearSession()
      
      // ゲストロールに更新してログインページへリダイレクト
      updateRole('guest')
      navigateStatic('public', 'login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const navItems = [
    {
      label: 'ホーム',
      onClick: () => navigateStatic('public', 'home'),
      showFor: ['guest', 'user', 'admin'],
    },
    {
      label: 'プロフィール',
      onClick: () => navigateStatic('user', 'profile'),
      showFor: ['admin', 'guest'],
    },
    {
      label: 'ダッシュボード',
      onClick: () => navigateStatic('user', 'dashboard'),
      showFor: ['admin', 'guest'],
    },
    { label: 'ユーザー管理', onClick: () => navigateStatic('admin', 'users'), showFor: ['admin'] },
  ]

  const filteredNavItems = navItems.filter((item) => item.showFor.includes(currentRole))

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div
              className={twMerge(
                'hidden md:flex md:space-x-4',
                isMenuOpen
                  ? 'absolute top-full left-0 right-0 flex flex-col bg-white shadow-md p-4 space-y-2'
                  : '',
              )}
            >
              {filteredNavItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={item.onClick}
                  className={twMerge(
                    'text-gray-700 hover:text-gray-900',
                    isMenuOpen ? 'w-full justify-start' : '',
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            {currentRole === 'guest' ? (
              <div className="space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigateStatic('public', 'login')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ログイン
                </Button>
                <Button
                  onClick={() => navigateStatic('public', 'register')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  新規登録
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">アカウント</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => navigateStatic('user', 'profile')}>
                    プロフィール
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-red-600 hover:text-red-800"
                  >
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
