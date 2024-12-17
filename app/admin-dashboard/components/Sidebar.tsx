import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileStack,
  LogOut,
  Menu,
  X 
} from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface NavItem {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

export default function Sidebar({ sidebarOpen, toggleSidebar, activeTab, setActiveTab }: SidebarProps) {
  const navigation: NavItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      description: 'Overview and analytics'
    },
    {
      id: 'users',
      name: 'Users',
      icon: <Users size={20} />,
      description: 'Manage user accounts'
    },
    {
      id: 'vcards',
      name: 'vCards',
      icon: <CreditCard size={20} />,
      description: 'Digital business cards'
    },
    {
      id: 'plantemplates',
      name: 'Plan Templates',
      icon: <FileStack size={20} />,
      description: 'Subscription templates'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed md:sticky top-0 left-0 z-30
          h-screen w-72 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-200 ease-in-out
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">vCard Admin</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.name)}
                className={`
                  group w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200 ease-in-out
                  ${activeTab === item.name 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <span className={`
                  p-2 rounded-lg transition-colors
                  ${activeTab === item.name 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }
                `}>
                  {item.icon}
                </span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg
              text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 
              hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <span className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <LogOut size={20} />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}