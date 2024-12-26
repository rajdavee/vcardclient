export function CTASection() {
    return (
      <section className="w-full py-8 sm:py-12 md:py-20 lg:py-32 bg-indigo-600">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter text-white mb-4 sm:mb-6">Ready to Elevate Your Networking?</h2>
          <p className="max-w-[600px] text-sm sm:text-base md:text-xl text-indigo-100 mx-auto mb-6 sm:mb-8 px-4">
            Join thousands of professionals who are making lasting impressions with vCard Pro.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center max-w-md mx-auto px-4">
            <input 
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 placeholder-gray-500" 
              placeholder="Enter your email" 
              type="email" 
            />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">Get Started</button>
          </div>
        </div>
      </section>
    )
  }