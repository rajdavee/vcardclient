import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Maximize, 
  Minimize,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  Mail,
  User,
  Crown
} from 'lucide-react';

interface TopBarProps {
  toggleSidebar: () => void;
  activeTab: string;
}

interface Notification {
  id: number;
  type: 'message' | 'alert' | 'update';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function TopBar({ toggleSidebar, activeTab }: TopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'System Update',
      description: 'New features have been deployed',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'message',
      title: 'New User Registration',
      description: 'A new enterprise user has joined',
      time: '1h ago',
      read: false
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
          >
            <Menu size={24} />
          </button>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-400 dark:text-gray-500">/</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{activeTab}</span>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`
                w-64 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                rounded-lg py-2 px-4 pl-10 transition-all duration-200
                border border-transparent
                ${searchFocused 
                  ? 'w-80 border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-gray-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/80'
                }
              `}
            />
            <Search 
              className={`absolute left-3 top-2.5 transition-colors duration-200 ${
                searchFocused ? 'text-blue-500' : 'text-gray-400'
              }`} 
              size={18} 
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs 
                  font-medium rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg 
                shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer 
                        transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                          notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
                          'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                        }`}>
                          {notification.type === 'message' ? <Mail size={16} /> :
                           notification.type === 'alert' ? <Bell size={16} /> :
                           <HelpCircle size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen} 
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
              rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                transition-colors"
            >
              <div className="relative h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  System Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Super Admin
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg 
                shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    System Administrator
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@system.com
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                  hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <Shield size={16} />
                  <span>Admin Panel</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                  hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 
                    hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}