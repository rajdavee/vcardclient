'use client'
import Link from "next/link"
import { 
  IdCard, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [planName, setPlanName] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoggedIn(false)
          return
        }

        setIsLoggedIn(true)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-plan`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPlanName(data.planName)
        }
      } catch (error) {
        console.error('Failed to fetch user plan:', error)
      }
    }

    fetchUserPlan()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setPlanName(null)
    router.push('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#examples", label: "Examples" },
    { href: "#pricing", label: "Pricing" }
  ]

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-1.5 sm:space-x-2 group"
        >
          <IdCard 
            className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600 group-hover:rotate-6 transition-transform" 
            strokeWidth={2} 
          />
          <span className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            vCard Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Link
                href="/uservcards"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors group"
              >
                <IdCard className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:text-indigo-600" />
                <span className="hidden sm:inline">My VCards</span>
              </Link>

              {planName && (
                <span className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {planName} Plan
                </span>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-colors group"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:text-red-600" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden text-gray-700 hover:text-indigo-600 p-1"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white shadow-lg border-t"
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <Link
                      href="/uservcards"
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <IdCard className="h-4 w-4 mr-2" />
                      My VCards
                    </Link>
                    {planName && (
                      <div className="px-2">
                        <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          {planName} Plan
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        toggleMobileMenu()
                      }}
                      className="flex items-center w-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}