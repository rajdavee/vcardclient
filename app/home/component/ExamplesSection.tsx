// import { Smartphone, Mail } from "lucide-react"

// export function ExamplesSection() {
//   return (
//     <section id="examples" className="w-full py-12 md:py-24 lg:py-32 bg-white">
//       <div className="container px-4 md:px-6">
//         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">vCard Examples</h2>
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {[
//             { name: "Alex Chen", role: "Software Engineer", color: "from-blue-500 to-cyan-500" },
//             { name: "Emily Watson", role: "Marketing Specialist", color: "from-pink-500 to-rose-500" },
//             { name: "Michael Rodriguez", role: "Financial Advisor", color: "from-green-500 to-emerald-500" },
//             { name: "Sophia Kim", role: "Graphic Designer", color: "from-purple-500 to-indigo-500" },
//           ].map((card, index) => (
//             <div key={index} className="relative group">
//               <div className={`absolute inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`} />
//               <div className="relative bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
//                 <div>
//                   <h3 className="text-lg font-bold mb-1 text-gray-900">{card.name}</h3>
//                   <p className="text-sm text-gray-600 mb-4">{card.role}</p>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <Smartphone className="w-4 h-4 text-gray-400" />
//                       <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Mail className="w-4 h-4 text-gray-400" />
//                       <span className="text-sm text-gray-600">contact@example.com</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 mt-4">View Full Card</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Smartphone, Mail } from "lucide-react";
import Image from "next/image";

const cards = [
  { name: "Alex Chen", role: "Software Engineer", color: "from-blue-500 to-cyan-500", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww" },
  { name: "Emily Watson", role: "Marketing Specialist", color: "from-pink-500 to-rose-500", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D" },
  { name: "Michael Rodriguez", role: "Financial Advisor", color: "from-green-500 to-emerald-500", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww" },
  { name: "Sophia Kim", role: "Graphic Designer", color: "from-purple-500 to-indigo-500", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D" },
  { name: "David Lee", role: "Product Manager", color: "from-yellow-500 to-amber-500", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D" },
  { name: "Olivia Brown", role: "UX Researcher", color: "from-red-500 to-orange-500", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww" },
  { name: "Ethan Taylor", role: "Data Scientist", color: "from-teal-500 to-green-500", image: "https://images.unsplash.com/photo-1556157382-97eda2f9e5d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww" },
  { name: "Isabella Martinez", role: "Content Strategist", color: "from-indigo-500 to-blue-500", image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D" },
];

interface CardProps {
  card: {
    name: string;
    role: string;
    color: string;
    image: string;
  };
}

const MobileCard: React.FC<CardProps> = ({ card }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <div className="flex items-center mb-3">
      <Image src={card.image} alt={card.name} width={60} height={60} className="rounded-full mr-3" />
      <div>
        <h3 className="font-bold text-gray-900">{card.name}</h3>
        <p className="text-sm text-gray-600">{card.role}</p>
      </div>
    </div>
    <div className="space-y-1">
      <div className="flex items-center">
        <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
      </div>
      <div className="flex items-center">
        <Mail className="w-4 h-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">contact@example.com</span>
      </div>
    </div>
  </div>
);

const DesktopCard: React.FC<CardProps> = ({ card }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative group w-64 h-[420px] flex-shrink-0"
  >
    <div className={`absolute inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`} />
    <div className="relative bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
          <Image src={card.image} alt={card.name} width={128} height={128} className="object-cover w-full h-full" />
        </div>
        <h3 className="text-lg font-bold mb-1 text-gray-900 text-center">{card.name}</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">{card.role}</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">contact@example.com</span>
          </div>
        </div>
      </div>
      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 mt-4 w-full">
        View Full Card
      </button>
    </div>
  </motion.div>
);

export function ExamplesSection() {
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 100]),
    springConfig
  );

  return (
    <section ref={ref} id="examples" className="w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-4 sm:mb-6 text-gray-900">vCard Examples</h2>
        <p className="text-base sm:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          Discover how professionals across various industries showcase their contact information with style. These vCard examples demonstrate the perfect blend of personality and professionalism.
        </p>
        {isMobile ? (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <MobileCard key={index} card={card} />
            ))}
          </div>
        ) : (
          <motion.div
            style={{
              rotateX,
              rotateZ,
              translateY,
              opacity,
            }}
            className="space-y-20"
          >
            <motion.div className="flex space-x-6 mb-20">
              {cards.slice(0, 4).map((card, index) => (
                <DesktopCard key={index} card={card} />
              ))}
            </motion.div>
            <motion.div className="flex space-x-6">
              {cards.slice(4).map((card, index) => (
                <DesktopCard key={index + 4} card={card} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
