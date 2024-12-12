import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  CreditCard, 
  Wallet, 
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  X 
} from 'lucide-react'
import { theme } from '../theme-constants'

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface NavItem {
  name: string
  icon: React.ReactNode
  badge?: number | string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export default function Sidebar({ sidebarOpen, toggleSidebar, activeTab, setActiveTab }: SidebarProps) {
  const navigation: NavGroup[] = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Analytics', icon: <BarChart2 size={20} />, badge: 'New' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Users', icon: <Users size={20} />, badge: 12 },
        { name: 'vCards', icon: <CreditCard size={20} /> },
        { name: 'Payments', icon: <Wallet size={20} /> },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', icon: <Settings size={20} /> },
        { name: 'Notifications', icon: <Bell size={20} />, badge: 3 },
        { name: 'Help', icon: <HelpCircle size={20} /> },
      ]
    }
  ]

  return (
    <aside 
      className={`
        fixed md:static inset-y-0 left-0 z-20
        w-64 bg-white border-r border-gray-200
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col h-screen
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary-main flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900">AdminPro</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          {navigation.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="mt-3 space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`
                      group w-full flex items-center justify-between px-4 py-2 rounded-lg
                      transition-all duration-200 ease-in-out
                      ${activeTab === item.name 
                        ? 'bg-primary-light/10 text-primary-main' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-main'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={activeTab === item.name ? 'text-primary-main' : 'text-gray-400 group-hover:text-primary-main'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs rounded-full
                        ${typeof item.badge === 'number'
                          ? 'bg-primary-light/10 text-primary-main'
                          : 'bg-green-100 text-green-700'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button 
          className="w-full flex items-center justify-between px-4 py-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>
    </aside>
  )
}