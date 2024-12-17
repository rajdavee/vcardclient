'use client'

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Eye, 
  UserPlus,
  Clock,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const inter = Inter({ subsets: ['latin'] });

export default function NewAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { 
      title: 'Total vCards', 
      value: '1,234', 
      change: '+5.3%', 
      trend: 'up',
      icon: CreditCard,
      color: 'blue',
      stats: { daily: 12, weekly: 85, monthly: 342 }
    },
    { 
      title: 'Active Users', 
      value: '789', 
      change: '+2.7%', 
      trend: 'up',
      icon: Users,
      color: 'purple',
      stats: { daily: 8, weekly: 56, monthly: 234 }
    },
    { 
      title: 'Revenue', 
      value: '$12,345', 
      change: '-1.2%', 
      trend: 'down',
      icon: DollarSign,
      color: 'green',
      stats: { daily: 450, weekly: 3200, monthly: 12345 }
    },
    { 
      title: 'Total Views', 
      value: '45.2K', 
      change: '+8.1%', 
      trend: 'up',
      icon: Eye,
      color: 'orange',
      stats: { daily: 1200, weekly: 8500, monthly: 45200 }
    }
  ];

  const recentActivity = [
    { 
      user: { name: 'Alice Smith', avatar: '👩‍💼', role: 'Premium User' },
      action: 'Created new vCard',
      type: 'create',
      time: '5 minutes ago',
      details: 'Business Template'
    },
    { 
      user: { name: 'Bob Johnson', avatar: '👨‍💼', role: 'Enterprise User' },
      action: 'Updated profile',
      type: 'update',
      time: '2 hours ago',
      details: 'Changed contact info'
    },
    { 
      user: { name: 'Charlie Brown', avatar: '🧑‍💼', role: 'Basic User' },
      action: 'Upgraded plan',
      type: 'upgrade',
      time: '1 day ago',
      details: 'Basic → Premium'
    }
  ];

  // Sample data for charts
  const lineChartData = [
    { name: 'Day 1', vCards: 30 },
    { name: 'Day 2', vCards: 45 },
    { name: 'Day 3', vCards: 60 },
    { name: 'Day 4', vCards: 50 },
    { name: 'Day 5', vCards: 70 },
    { name: 'Day 6', vCards: 90 },
    { name: 'Day 7', vCards: 100 },
  ];

  const barChartData = [
    { name: 'User Type A', value: 400 },
    { name: 'User Type B', value: 300 },
    { name: 'User Type C', value: 300 },
    { name: 'User Type D', value: 200 },
  ];

  const pieChartData = [
    { name: 'Business', value: 400 },
    { name: 'Personal', value: 300 },
    { name: 'Other', value: 300 },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${inter.className}`}>
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="loader w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Welcome back, Admin
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Here's what's happening with your vCards today
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                Export Report
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.title}</h2>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                      <span className={`flex items-center text-sm ${
                        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {metric.change}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Daily</p>
                        <p className="font-medium text-gray-900 dark:text-white">{metric.stats.daily}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Weekly</p>
                        <p className="font-medium text-gray-900 dark:text-white">{metric.stats.weekly}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Monthly</p>
                        <p className="font-medium text-gray-900 dark:text-white">{metric.stats.monthly}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  vCard Creation Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <Line type="monotone" dataKey="vCards" stroke="#4F46E5" />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  User Demographics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#4F46E5">
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Revenue Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <Bar dataKey="value" fill="#4F46E5" />
                    <Tooltip />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  vCard Usage Statistics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <Line type="monotone" dataKey="vCards" stroke="#4F46E5" />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-2xl">{activity.user.avatar}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.action}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activity.details}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
