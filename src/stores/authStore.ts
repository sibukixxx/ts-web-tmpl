// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthTokens {
  access_token: string
  expires_at: number // UNIX タイムスタンプで管理
}

interface SupabaseUser {
  id: string
  email: string
}

interface SupabaseSession {
  auth: AuthTokens
  user: SupabaseUser
}

interface AuthStore {
  session: SupabaseSession | null
  setSession: (session: SupabaseSession | null) => void
  clearSession: () => void
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'auth-storage', // localStorage に保存されるキー名
      // storage: createJSONStorage(() => sessionStorage) などでsessionStorageにも変更可
    }
  )
)
