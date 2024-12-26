import React from 'react';
import { Smartphone, Shield, Zap, Globe, CreditCard, BarChart } from "lucide-react";

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export function FeaturesSection() {
  const features = [
    { icon: Smartphone, title: "Mobile-Friendly", description: "Your vCard looks great on any device, ensuring a seamless experience for your contacts." },
    { icon: Shield, title: "Secure & Private", description: "Your information is protected with state-of-the-art encryption and privacy controls." },
    { icon: Zap, title: "Instant Updates", description: "Change your details on the fly, and see updates reflect instantly across all shared cards." },
    { icon: Globe, title: "Global Reach", description: "Share your card with anyone, anywhere in the world, breaking down geographical barriers." },
    { icon: CreditCard, title: "Custom Design", description: "Create a card that truly represents your brand with our advanced customization tools." },
    { icon: BarChart, title: "Insightful Analytics", description: "Track views, clicks, and interactions to optimize your networking strategy." },
  ];

  return (
    <section id="features" className="w-full py-8 sm:py-12 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter text-center mb-8 sm:mb-12 text-gray-900 dark:text-gray-100">
          Why Choose vCard Pro?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-0 relative z-10">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const Feature = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-6 sm:py-8 lg:py-10 relative group/feature",
        "border-b sm:border-none lg:border-r dark:border-neutral-800",
        (index === 0 || index === 3) ? "lg:border-l dark:border-neutral-800" : "",
        index < 3 ? "lg:border-b dark:border-neutral-800" : "",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-200 dark:from-neutral-700 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-200 dark:from-neutral-700 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 sm:mb-4 relative z-10 px-6 sm:px-8 lg:px-10 text-indigo-600 dark:text-indigo-400 group-hover/feature:text-indigo-700 dark:group-hover/feature:text-indigo-300 transition-colors duration-200">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>
      <div className="text-lg sm:text-xl font-bold mb-2 relative z-10 px-6 sm:px-8 lg:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-indigo-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-900 dark:text-gray-100 group-hover/feature:text-indigo-700 dark:group-hover/feature:text-indigo-300">
          {title}
        </span>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xs relative z-10 px-6 sm:px-8 lg:px-10 group-hover/feature:text-gray-800 dark:group-hover/feature:text-gray-100 transition-colors duration-200">
        {description}
      </p>
    </div>
  );
};
