import React from 'react'
import { Users, CreditCard, Activity, BarChart2 } from 'lucide-react'

interface QuickStatsProps {
  stats: any
  userAnalytics: any
  isLoading: boolean
}

export default function QuickStats({ stats, userAnalytics, isLoading }: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const quickStats = [
    { title: 'Total Users', icon: <Users className="text-blue-500" />, value: stats.totalUsers, change: '+5.2%', changeType: 'increase' },
    { title: 'Total vCards', icon: <CreditCard className="text-green-500" />, value: stats.totalVCards, change: '+3.1%', changeType: 'increase' },
    { title: 'Total Scans', icon: <Activity className="text-yellow-500" />, value: stats.totalScans, change: '+7.6%', changeType: 'increase' },
    { title: 'Premium Users', icon: <BarChart2 className="text-purple-500" />, value: userAnalytics.premiumUsers, change: '-2.5%', changeType: 'decrease' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gray-100">
              {stat.icon}
            </div>
            <span className={`text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
