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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <FeaturesSection />

        <ExamplesSection />
        <FreeVcardGenerator />

        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}