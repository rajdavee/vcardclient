'use client'

import React, { useState, useEffect } from 'react'
import { fetchAdminData } from '../api/admin'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import QuickStats from './components/QuickStats'
import UserManagement from './components/UserManagement'
import VCardManagement from './components/VCardManagement'
import PlanTemplateManagement from './components/PlanTemplateManagement'
import LoadingSpinner from '../components/LoadingSpinner'
import NewAdminDashboard from './components/NewAdminDashboard'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [adminData, setAdminData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAdminData()
      setAdminData(data)
    } catch (err) {
      setError('Failed to load admin data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} activeTab={activeTab} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'Dashboard' && <NewAdminDashboard />}
            {activeTab === 'Users' && <UserManagement users={adminData.users} loadAdminData={loadAdminData} />}
            {activeTab === 'vCards' && <VCardManagement loadAdminData={loadAdminData} />}
            {activeTab === 'Plan Templates' && <PlanTemplateManagement />}
          </div>
        </main>
      </div>
    </div>
  )
}
