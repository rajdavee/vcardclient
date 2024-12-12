import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserTie, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

export const FreeVcardGenerator: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden relative flex flex-col md:flex-row">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMiAyaDJ2MkgyeiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                >
                  <HiSparkles className="text-blue-600 mr-2" />
                  <span className="text-blue-600 font-medium">Free vCard Generator</span>
                </motion.div>

                <h1 className="text-6xl md:text-7xl font-bold">
                  <span className="text-gray-900">Create Your</span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Digital Identity
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your professional presence with our premium digital business cards. 
                  Make meaningful connections in the digital age.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/generate-vcard" passHref>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg hover:shadow-blue-200"
                  >
                    <span className="relative flex items-center justify-center gap-2 font-semibold text-lg">
                      <FaUserTie />
                      Create Your vCard
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 shadow-md hover:shadow-lg transition-all"
                >
                  View Examples
                </motion.button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "⚡️", text: "Instant Creation", desc: "Ready in seconds" },
                  { icon: "💎", text: "Premium Design", desc: "Professional templates" },
                  { icon: "📱", text: "Mobile Ready", desc: "Works everywhere" },
                  { icon: "🔄", text: "Easy Updates", desc: "Change anytime" }
                ].map((feature) => (
                  <motion.div
                    key={feature.text}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.text}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Interactive Card Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: isHovered ? 0 : 5 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
              >
                <div className="space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto relative">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                        alt="Profile"
                        className="rounded-full object-cover ring-4 ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">Emma Watson</h3>
                    <p className="text-blue-600">Product Design Lead</p>
                    
                    <div className="flex justify-center gap-4">
                      {[FaLinkedin, FaGithub, FaEnvelope].map((Icon, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Icon className="text-xl" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg"
                  >
                    Download vCard
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-white border border-gray-100 shadow-lg">
            <p className="text-gray-600">
              <span className="text-blue-600 font-bold">10,000+</span> Professionals Trust Us
            </p>
            <div className="w-px h-6 bg-gray-200" />
            <p className="text-gray-600">
              <span className="text-blue-600 font-bold">100%</span> Free
            </p>
            <div className="w-px h-6 bg-gray-200" />
            <p className="text-gray-600">No Credit Card Required</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeVcardGenerator;