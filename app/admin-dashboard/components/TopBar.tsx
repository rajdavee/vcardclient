import React, { useState } from 'react'
import { Search, Bell, ChevronDown, Menu, Maximize, Minimize } from 'lucide-react'

interface TopBarProps {
  toggleSidebar: () => void
  activeTab: string
}

export default function TopBar({ toggleSidebar, activeTab }: TopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <header className="bg-white shadow-md z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">{activeTab}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 text-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
          <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
            <span className="sr-only">Notifications</span>
            <Bell size={18} />
            <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={toggleFullscreen} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <img className="h-8 w-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
              <span className="hidden md:inline-block font-medium text-gray-700">John Doe</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
        </div>
      </div>
    </header>
  )
}