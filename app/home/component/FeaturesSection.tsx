import { Smartphone, Shield, Zap, Globe, CreditCard, BarChart } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">Why Choose vCard Pro?</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            // { icon: Smartphone, title: "Mobile-Friendly", description: "Your vCard looks great on any device, ensuring a seamless experience for your contacts." },
            { icon: Smartphone, title: "Mobile-Friendly", description: "hello from raj dave" },
            { icon: Shield, title: "Secure & Private", description: "Your information is protected with state-of-the-art encryption and privacy controls." },
            { icon: Zap, title: "Instant Updates", description: "Change your details on the fly, and see updates reflect instantly across all shared cards." },
            { icon: Globe, title: "Global Reach", description: "Share your card with anyone, anywhere in the world, breaking down geographical barriers." },
            { icon: CreditCard, title: "Custom Design", description: "Create a card that truly represents your brand with our advanced customization tools." },
            { icon: BarChart, title: "Insightful Analytics", description: "Track views, clicks, and interactions to optimize your networking strategy." },
          ].map((feature, index) => (
            <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col items-center text-center p-6">
              <feature.icon className="w-12 h-12 mb-4 text-indigo-600" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}