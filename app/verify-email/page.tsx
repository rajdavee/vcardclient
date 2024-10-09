'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

function VerifyEmailContent() {
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      if (!token) {
        setMessage('Invalid verification link.')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email/${token}`, {
          method: 'GET',
        })

        const data = await response.json()

        if (response.ok) {
          setMessage('Email verified successfully. You can now log in.')
          setTimeout(() => router.push('/login'), 3000) // Redirect to login page after 3 seconds
        } else {
          setMessage(data.error || 'Email verification failed. Please try again.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}