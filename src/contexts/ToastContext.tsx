import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
  onToastAdd: (toast: Toast) => void
}

export function ToastProvider({ children, onToastAdd }: ToastProviderProps) {
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(7)
    onToastAdd({ id, message, type })
  }, [onToastAdd])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

