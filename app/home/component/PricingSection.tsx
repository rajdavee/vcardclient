'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Load Stripe instance with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  name: string;
  price: number;
  features: string[];
}

export function PricingSection() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserPlan(token);
    }

    checkPaymentStatus();
  }, []);

  const fetchUserPlan = async (token: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'user-plan' })
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.planName);
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
      setError('Failed to load user plan. Please try again later.');
    }
  };

  const checkPaymentStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const newPlan = urlParams.get('plan');

    if (paymentStatus === 'success' && newPlan) {
      setUserPlan(decodeURIComponent(newPlan));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handlePayment = async (planName: string, price: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return false;
      }

      const amount = Math.round(price * 100);
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'create-checkout-session', planName, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error('No session ID returned from the server');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while processing your payment. Please try again.');
      return false;
    }
  };

  const handleGetStarted = async (planName: string) => {
    setLoading(true);
    setError(null);

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      const plan = plans.find(p => p.name === planName);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }
      
      const success = await handlePayment(planName, plan.price);
      
      if (success) {
        console.log('Redirected to Stripe checkout');
      } else {
        setError('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const plans: Plan[] = [
    {
      name: "Basic",
      price: 9.99,
      features: ["1 vCard", "Basic customization", "1GB storage", "Email support"],
    },
    {
      name: "Pro",
      price: 19.99,
      features: ["5 vCards", "Advanced customization", "5GB storage", "Priority support", "Analytics dashboard"],
    },
    {
      name: "Enterprise",
      price: 0, // Custom pricing
      features: ["Unlimited vCards", "Full customization", "Unlimited storage", "24/7 support", "Advanced analytics", "API access"],
    },
  ];

  return (
    <section id="pricing" className="w-full py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no surprises.
          </p>
        </div>

        {error && (
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-red-500 bg-red-50 py-2 px-4 rounded-lg inline-block">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-screen-xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl border bg-white dark:bg-gray-800 shadow-sm transition-shadow hover:shadow-md flex flex-col p-6 sm:p-8 ${
                index === 1 ? 'border-indigo-600 border-2 lg:scale-105' : 'border-gray-200'
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-indigo-600">${plan.price}</span>
                  {plan.price > 0 && <span className="text-sm text-gray-500 ml-1">/month</span>}
                </div>
              </div>

              <ul className="mb-6 space-y-3 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 mr-2 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleGetStarted(plan.name)}
                disabled={loading || (userPlan === plan.name)}
                className={`mt-4 w-full rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  userPlan === plan.name
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : userPlan === plan.name ? (
                  'Current Plan'
                ) : plan.price === 0 ? (
                  'Contact Sales'
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}