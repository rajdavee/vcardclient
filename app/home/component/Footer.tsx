// import Link from "next/link"

// export function Footer() {
//   return (
//      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
//     <p className="text-xs text-gray-500">© 2024 vCard Pro. All rights reserved.</p>
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
    <footer className="bg-gray-50 py-12 border-t">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">vCard Pro</span>
          </div>
          <p className="text-sm text-gray-600">
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
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
          <nav className="space-y-2">
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
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
          <nav className="space-y-2">
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
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Stay Updated</h4>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 mt-8 pt-6 border-t text-center">
        <p className="flex items-center justify-center text-sm text-gray-600">
          <Copyright className="h-4 w-4 mr-2" />
          {currentYear} vCard Pro. All rights reserved.
        </p>
      </div>
    </footer>
  )
}