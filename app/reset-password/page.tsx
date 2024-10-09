'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reset-password',
          token,
          password
        }),
      })
      const data = await response.json()
      
      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...')
        setTimeout(() => router.push('/'), 3000)
      } else {
        setMessage(data.error || 'An unexpected error occurred. Please try again.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-80 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !token}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        </div>
      </motion.div>
    </div>
  )
}

const ResetPassword: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

export default ResetPassword
