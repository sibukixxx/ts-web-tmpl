import { create } from 'zustand'
import { UserFormData } from '@/schemas/userSchema'

interface UserStore {
  user: UserFormData | null
  setUser: (user: UserFormData) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
