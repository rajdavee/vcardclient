import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserTie, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

export const FreeVcardGenerator: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden relative">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMiAyaDJ2MkgyeiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8 lg:space-y-10"
            >
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                >
                  <HiSparkles className="text-blue-600 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-blue-600 font-medium text-sm sm:text-base">Free vCard Generator</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
                  <span className="text-gray-900">Create Your</span>
                  <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Digital Identity
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                  Transform your professional presence with our premium digital business cards. 
                  Make meaningful connections in the digital age.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/generate-vcard" passHref>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg hover:shadow-blue-200 w-full sm:w-auto"
                  >
                    <span className="relative flex items-center justify-center gap-2 font-semibold text-base sm:text-lg">
                      <FaUserTie className="h-4 w-4 sm:h-5 sm:w-5" />
                      Create Your vCard
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-base sm:text-lg"
                >
                  View Examples
                </motion.button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[ 
                  { icon: "⚡️", text: "Instant Creation", desc: "Ready in seconds" },
                  { icon: "💎", text: "Premium Design", desc: "Professional templates" },
                  { icon: "📱", text: "Mobile Ready", desc: "Works everywhere" },
                  { icon: "🔄", text: "Easy Updates", desc: "Change anytime" }
                ].map((feature) => (
                  <motion.div
                    key={feature.text}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="text-xl sm:text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{feature.text}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Interactive Card Preview */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-md mx-auto">
                <div className="space-y-6 sm:space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto relative">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                        alt="Profile"
                        className="rounded-full object-cover ring-4 ring-blue-100 w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Emma Watson</h3>
                    <p className="text-blue-600 text-sm sm:text-base">Product Design Lead</p>
                    
                    <div className="flex justify-center gap-3 sm:gap-4">
                      {[FaLinkedin, FaGithub, FaEnvelope].map((Icon, index) => (
                        <button
                          key={index}
                          className="p-1.5 sm:p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Icon className="text-lg sm:text-xl" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg text-sm sm:text-base"
                  >
                    Download vCard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 sm:px-8 py-4 rounded-2xl bg-white border border-gray-100 shadow-lg">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="text-blue-600 font-bold">10,000+</span> Professionals Trust Us
            </p>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="text-blue-600 font-bold">100%</span> Free
            </p>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />
            <p className="text-gray-600 text-sm sm:text-base">No Credit Card Required</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeVcardGenerator;
