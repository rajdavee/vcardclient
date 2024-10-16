'use client'

import { useState } from 'react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { ChevronDown } from 'lucide-react'

interface DetailedAnalyticsProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}

export default function DetailedAnalytics({ showDetails, setShowDetails }: DetailedAnalyticsProps) {
  // Mock data for the dashboard
  const geographicData = [
    { name: 'New York', value: 400 },
    { name: 'London', value: 300 },
    { name: 'Tokyo', value: 200 },
    { name: 'Paris', value: 150 },
    { name: 'Berlin', value: 100 },
  ]

  const engagementData = [
    { name: 'Profile', clicks: 1200 },
    { name: 'Portfolio', clicks: 900 },
    { name: 'Contact', clicks: 600 },
    { name: 'Resume', clicks: 400 },
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Detailed Analytics
          </h3>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
            <ChevronDown className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {showDetails && (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold mb-4">Geographic Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={geographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Engagement Metrics</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}