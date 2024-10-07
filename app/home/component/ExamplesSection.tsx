import { Smartphone, Mail } from "lucide-react"

export function ExamplesSection() {
  return (
    <section id="examples" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">vCard Examples</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { name: "Alex Chen", role: "Software Engineer", color: "from-blue-500 to-cyan-500" },
            { name: "Emily Watson", role: "Marketing Specialist", color: "from-pink-500 to-rose-500" },
            { name: "Michael Rodriguez", role: "Financial Advisor", color: "from-green-500 to-emerald-500" },
            { name: "Sophia Kim", role: "Graphic Designer", color: "from-purple-500 to-indigo-500" },
          ].map((card, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`} />
              <div className="relative bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-900">{card.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{card.role}</p>
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
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 mt-4">View Full Card</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}