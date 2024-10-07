'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from "./component/Header"
import { HeroSection } from "./component/HeroSection"
import { FeaturesSection } from "./component/FeaturesSection"
import { ExamplesSection } from "./component/ExamplesSection"
import { PricingSection } from "./component/PricingSection"
import { CTASection } from "./component/CTASection"
import { Footer } from "./component/Footer"

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null // or a loading component
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ExamplesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}