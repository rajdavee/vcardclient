'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Smartphone, Mail, Globe } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userPlan, setUserPlan] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsAuthenticated(false)
          return
        }

        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ action: 'getUser' })
        })
        setIsAuthenticated(response.ok)

        if (response.ok) {
          const planResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-plan`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (planResponse.ok) {
            const { planName } = await planResponse.json()
            setUserPlan(planName)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleGetStarted = async () => {
    setIsLoading(true)

    try {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (!userPlan) {
        throw new Error('User plan not found')
      }

      console.log('User plan:', userPlan) // Add this line for debugging

      switch(userPlan.toLowerCase()) {
        case 'basic':
          router.push('/basic')
          break
        case 'pro':
          router.push('/pro')
          break
        case 'premium':
          router.push('/premium')
          break
        default:
          router.push('/generate-vcard')
      }
    } catch (error) {
      console.error('Error navigating to dashboard:', error)
      // router.push('/generate-vcard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                Your Digital Identity, Reimagined
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Create stunning digital business cards that leave a lasting impression. Stand out in the digital age with vCard Pro.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button 
                onClick={handleGetStarted}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isLoading ? 'Loading...' : (isAuthenticated ? 'Go to Dashboard' : 'Get Started')}
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-[280px] h-[560px] bg-gray-900 rounded-[60px] shadow-2xl p-6 transform rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-gray-800 rounded-b-[20px]" />
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[48px] overflow-hidden flex flex-col justify-between p-6 text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Sarah Johnson</h3>
                  <p className="text-sm opacity-80">UX Designer & Developer</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">sarah@design.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">www.sarahjohnson.design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}