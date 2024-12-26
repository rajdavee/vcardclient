'use client'

import { Header } from "./component/Header"
import { HeroSection } from "./component/HeroSection"
import { FeaturesSection } from "./component/FeaturesSection"
import { ExamplesSection } from "./component/ExamplesSection"
import { PricingSection } from "./component/PricingSection"
import { Footer } from "./component/Footer"
import { FreeVcardGenerator } from "./component/FreeVcardGenerator"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 w-full">
        {/* Hero Section with negative margin to account for fixed header */}
        <div className="pt-16">
          <HeroSection />
        </div>

        {/* Main content sections with proper spacing */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          <FreeVcardGenerator />
          <FeaturesSection />
          <ExamplesSection />
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}