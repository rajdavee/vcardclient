'use client'
import Link from "next/link"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"

export function Header() {
  const [planName, setPlanName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-plan`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPlanName(data.planName)
        }
      } catch (error) {
        console.error('Failed to fetch user plan:', error)
      }
    }

    fetchUserPlan()
  }, [])

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-200 bg-white">
      <Link className="flex items-center justify-center" href="#">
        <CreditCard className="h-6 w-6 text-indigo-600" />
        <span className="ml-2 text-2xl font-bold text-gray-900">vCard Pro</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors" href="#examples">
          Examples
        </Link>
        <Link className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors" href="#pricing">
          Pricing
        </Link>
        {planName && (
          <span className="text-sm font-medium text-indigo-600">
            {planName} Plan
          </span>
        )}
      </nav>
    </header>
  )
}