'use client'

import { useState } from 'react'
import OverviewCards from './OverviewCards'
import EngagementOverview from './EngagementOverview'
import DetailedAnalytics from './DetailedAnalytics'

export default function AnalyticsDashboard() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">vCard Analytics</span>
            </div>
            <div className="flex items-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          <OverviewCards />
          <EngagementOverview />
          <DetailedAnalytics showDetails={showDetails} setShowDetails={setShowDetails} />
        </div>
      </main>
    </div>
  )
}