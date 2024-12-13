import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Maximize, 
  Minimize,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Mail
} from 'lucide-react';
import { theme } from '../theme-constants';

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
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from Sarah',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'alert',
      title: 'System Update',
      description: 'System maintenance scheduled',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'update',
      title: 'Update Available',
      description: 'New version 2.0.0 is available',
      time: '2h ago',
      read: true
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
    // Clear user session data (this is just an example, adjust as needed)
    localStorage.removeItem('userSession'); // or any other session management logic
    // Redirect to login page or home page
    window.location.href = '/login'; // Adjust the path as necessary
  };

  return (
    <header className="bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-primary-main focus:outline-none focus:text-primary-main md:hidden"
          >
            <Menu size={24} />
          </button>
          <nav className="hidden md:flex items-center space-x-1">
            <span className="text-gray-400">/</span>
            <span className="text-primary-main font-medium">{activeTab}</span>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`
                w-64 bg-gray-50 text-gray-700 rounded-lg 
                py-2 px-4 pl-10 transition-all duration-200
                ${searchFocused 
                  ? 'w-80 bg-white ring-2 ring-primary-light' 
                  : 'hover:bg-gray-100'
                }
              `}
            />
            <Search 
              className={`absolute left-3 top-2.5 transition-colors duration-200 ${
                searchFocused ? 'text-primary-main' : 'text-gray-400'
              }`} 
              size={18} 
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:bg-primary-light/10 hover:text-primary-main rounded-lg transition-colors"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-main text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'alert' ? 'bg-red-100 text-red-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {notification.type === 'message' ? <Mail size={16} /> :
                           notification.type === 'alert' ? <Bell size={16} /> :
                           <HelpCircle size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
            className="p-2 text-gray-500 hover:bg-primary-light/10 hover:text-primary-main rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-light/10 transition-colors"
            >
              <img 
                className="h-8 w-8 rounded-full ring-2 ring-primary-light object-cover" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User avatar" 
              />
              <span className="hidden md:inline-block font-medium text-gray-700">John Doe</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2" onClick={handleLogout}>
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