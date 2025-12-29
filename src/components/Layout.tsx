import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import ToastContainer from './ToastContainer'
import { ToastProvider } from '../contexts/ToastContext'
import AuthButtons from './AuthButtons'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error'
}

export default function Layout() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const handleToastAdd = (toast: Toast) => {
    setToasts((prev) => [...prev, toast])
  }

  const handleToastRemove = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastProvider onToastAdd={handleToastAdd}>
      <div className="min-h-screen flex flex-col">
        <ToastContainer toasts={toasts} onRemove={handleToastRemove} />
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Quiz App
            </Link>
            <div className="flex gap-4 items-center">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Home
              </Link>
              <AuthButtons />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Quiz App. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </ToastProvider>
  )
}

