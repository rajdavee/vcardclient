import React from 'react'
import { BarChart2, Users, Activity, CreditCard, Settings, X } from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ sidebarOpen, toggleSidebar, activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className={`bg-gradient-to-b from-blue-800 to-indigo-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
      <nav>
        <div className="flex items-center justify-between mb-6 px-4">
          <span className="text-2xl font-bold">AdminPro</span>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        {['Dashboard', 'Users', 'Analytics', 'vCards', 'Payments', 'Settings'].map((item) => (
          <a
            key={item}
            href="#"
            className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${activeTab === item ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            onClick={() => setActiveTab(item)}
          >
            {item === 'Dashboard' && <BarChart2 size={20} />}
            {item === 'Users' && <Users size={20} />}
            {item === 'Analytics' && <Activity size={20} />}
            {item === 'vCards' && <CreditCard size={20} />}
            {item === 'Payments' && <CreditCard size={20} />}
            {item === 'Settings' && <Settings size={20} />}
            <span>{item}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}