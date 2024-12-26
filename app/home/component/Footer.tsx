// import Link from "next/link”

// export function Footer() {
//   return (
//      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
//     <p className="text-xs text-gray-500"> 2024 vCard Pro. All rights reserved.</p>
//     <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//       <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-900" href="#">
//         Terms of Service
//       </Link>
//       <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-900" href="#">
//         Privacy
//       </Link>
//     </nav>
//   </footer>
// )
// }


import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Copyright 
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/vcardpro", 
      label: "Facebook" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/vcardpro", 
      label: "Twitter" 
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/vcardpro", 
      label: "LinkedIn" 
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/vcardpro", 
      label: "Instagram" 
    }
  ]

  const quickLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/support", label: "Support" }
  ]

  const legalLinks = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" }
  ]

  return (
    <footer className="bg-gray-50 py-8 sm:py-12 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand and Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">vCard Pro</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Create professional digital business cards with ease. Connect, share, and grow your network.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 sm:mt-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Links</h4>
            <nav className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="mt-8 sm:mt-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Legal</h4>
            <nav className="space-y-2 sm:space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-8 lg:mt-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Stay Updated</h4>
            <form className="space-y-2 sm:space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center">
          <p className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
            <Copyright className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            {currentYear} vCard Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}