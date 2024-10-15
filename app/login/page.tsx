'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Custom SVG icon components
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Mail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Lock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const User = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Home: React.FC = () => {
  const [action, setAction] = useState<'login' | 'register' | 'forgot-password'>('login')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    if (action === 'register' && (!data.username || !data.email || !data.password)) {
      setMessage('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    if ((action === 'login' || action === 'forgot-password') && !data.email) {
      setMessage('Please enter your email.');
      setIsLoading(false);
      return;
    }
    if (action === 'login' && !data.password) {
      setMessage('Please enter your password.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          action, 
          ...data
        }),
      })
      const responseData = await response.json()
      
      if (!response.ok) {
        if (response.status === 403 && responseData.error === 'Please verify your email before logging in') {
          setMessage('Please verify your email before logging in. Need a new verification email?');
          setVerificationSent(true);
        } else {
          setMessage(responseData.error || 'An unexpected error occurred. Please try again.');
        }
      } else {
        if (action === 'login') {
          localStorage.setItem('token', responseData.token);
          const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
          localStorage.setItem('tokenExpiration', expirationTime.toString());
          localStorage.setItem('user', JSON.stringify(responseData.user));
          
          // Check if the user is an admin
          if (responseData.user.role === 'admin') {
            router.push('/admin-dashboard') // Redirect to admin dashboard
          } else {
            router.push('/home') // Redirect to regular user home
          }
        } else if (action === 'register') {
          setMessage('Registration successful. Please check your email to verify your account.')
          setVerificationSent(true)
        } else if (action === 'forgot-password') {
          setMessage('Password reset email sent. Please check your inbox.')
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (document.getElementById('email') as HTMLInputElement).value }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={action}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-80 p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {action === 'forgot-password' ? 'Reset Password' : (action === 'login' ? 'Welcome Back' : 'Create Account')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {action === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <input id="username" name="username" type="text" placeholder="John Doe" className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-600" />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input id="email" name="email" type="email" placeholder="you@example.com" className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-600" />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail />
                  </span>
                </div>
              </div>
              {(action === 'login' || action === 'register') && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-purple-600" />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock />
                    </span>
                  </div>
                </div>
              )}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (action === 'forgot-password' ? 'Send Reset Link' : (action === 'login' ? 'Log In' : 'Sign Up'))}
                {!isLoading && (
                  <span className="ml-2">
                    <ArrowRight />
                  </span>
                )}
              </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
            {verificationSent && (
              <button 
                onClick={handleResendVerification}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                Resend Verification Email
              </button>
            )}
            <div className="mt-6 text-center space-y-2">
              {action !== 'forgot-password' && (
                <button onClick={() => setAction(action === 'login' ? 'register' : 'login')} className="text-sm text-purple-600 hover:text-purple-800 transition duration-300">
                  {action === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              )}
              {action === 'login' && (
                <button onClick={() => setAction('forgot-password')} className="block w-full text-sm text-purple-600 hover:text-purple-800 transition duration-300">
                  Forgot Password?
                </button>
              )}
              {action === 'forgot-password' && (
                <button onClick={() => setAction('login')} className="text-sm text-purple-600 hover:text-purple-800 transition duration-300">
                  Back to Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Home