"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Smartphone, Github, Linkedin, Twitter, Calendar } from "lucide-react";

// LayoutGrid Component
const LayoutGrid = ({ cards }: { cards: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto"
    >
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          className={`relative h-[300px] rounded-xl overflow-hidden cursor-pointer ${card.className}`}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/90" />
          
          <motion.div
            className="w-full h-full"
            initial={false}
            animate={{
              scale: hoveredIndex === idx ? 1.05 : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={card.thumbnail}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 p-4 flex flex-col justify-end"
            initial={false}
            animate={{
              y: hoveredIndex === idx ? 0 : 10,
              opacity: hoveredIndex === idx ? 1 : 0.8,
            }}
            transition={{ duration: 0.4 }}
          >
            {card.content}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Main ExamplesSection Component
export function ExamplesSection() {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-4">
          Industry Leaders
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Connect with top professionals who are shaping the future of technology and innovation.
        </p>
      </div>
      <LayoutGrid cards={cards} />
    </section>
  );
}

// Card Components
const TechVisionaryCard = () => (
  <div className="flex flex-col justify-end">
    <div className="space-y-1.5">
      <div className="text-sm text-emerald-400 font-semibold">TECH VISIONARY</div>
      <p className="font-bold text-xl text-white">Elena Zhang</p>
      <p className="text-sm text-gray-200">AI Research Director at DeepMind</p>
      <div className="flex space-x-3 mt-2">
        <Github className="w-4 h-4 text-gray-200 hover:text-emerald-400 cursor-pointer transition-colors" />
        <Linkedin className="w-4 h-4 text-gray-200 hover:text-emerald-400 cursor-pointer transition-colors" />
        <Twitter className="w-4 h-4 text-gray-200 hover:text-emerald-400 cursor-pointer transition-colors" />
      </div>
    </div>
  </div>
);

const StartupFounderCard = () => (
  <div className="flex flex-col justify-end">
    <div className="space-y-1.5">
      <div className="text-sm text-blue-400 font-semibold">STARTUP FOUNDER</div>
      <p className="font-bold text-xl text-white">Marcus Rivera</p>
      <p className="text-sm text-gray-200">CEO of BlockChain Solutions</p>
      <div className="flex space-x-3 mt-2">
        <Mail className="w-4 h-4 text-gray-200 hover:text-blue-400 cursor-pointer transition-colors" />
        <Calendar className="w-4 h-4 text-gray-200 hover:text-blue-400 cursor-pointer transition-colors" />
        <Linkedin className="w-4 h-4 text-gray-200 hover:text-blue-400 cursor-pointer transition-colors" />
      </div>
    </div>
  </div>
);

const ProductDesignerCard = () => (
  <div className="flex flex-col justify-end">
    <div className="space-y-1.5">
      <div className="text-sm text-purple-400 font-semibold">DESIGN LEADER</div>
      <p className="font-bold text-xl text-white">Sophie Anderson</p>
      <p className="text-sm text-gray-200">Head of Design at Figma</p>
      <div className="flex space-x-3 mt-2">
        <Mail className="w-4 h-4 text-gray-200 hover:text-purple-400 cursor-pointer transition-colors" />
        <Twitter className="w-4 h-4 text-gray-200 hover:text-purple-400 cursor-pointer transition-colors" />
        <Smartphone className="w-4 h-4 text-gray-200 hover:text-purple-400 cursor-pointer transition-colors" />
      </div>
    </div>
  </div>
);

const CyberSecurityCard = () => (
  <div className="flex flex-col justify-end">
    <div className="space-y-1.5">
      <div className="text-sm text-red-400 font-semibold">SECURITY EXPERT</div>
      <p className="font-bold text-xl text-white">Alex Winters</p>
      <p className="text-sm text-gray-200">Chief Security Officer</p>
      <div className="flex space-x-3 mt-2">
        <Github className="w-4 h-4 text-gray-200 hover:text-red-400 cursor-pointer transition-colors" />
        <Mail className="w-4 h-4 text-gray-200 hover:text-red-400 cursor-pointer transition-colors" />
        <Linkedin className="w-4 h-4 text-gray-200 hover:text-red-400 cursor-pointer transition-colors" />
      </div>
    </div>
  </div>
);

const cards = [
  {
    id: 1,
    content: <TechVisionaryCard />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000&h=600",
  },
  {
    id: 2,
    content: <StartupFounderCard />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800&h=600",
  },
  {
    id: 3,
    content: <ProductDesignerCard />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=600",
  },
  {
    id: 4,
    content: <CyberSecurityCard />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2000&h=600",
  },
];