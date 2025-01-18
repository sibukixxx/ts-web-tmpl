'use client'

import { createContext, useContext, useState } from 'react'
import { Toast, ToastProvider } from '@/components/ui/toast'

const ToastContext = createContext<any>(null)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([])

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      <ToastProvider>{children}</ToastProvider>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => useContext(ToastContext)
