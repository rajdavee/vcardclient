// 'use client';
// import { useState, useEffect } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { Star } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// // Load Stripe instance with your public key
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// interface Plan {
//   name: string;
//   price: number;
//   features: string[];
// }

// export function PricingSection() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userPlan, setUserPlan] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserPlan = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-plan`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserPlan(data.planName);
//         }
//       } catch (error) {
//         console.error('Failed to fetch user plan:', error);
//         setError('Failed to load user plan. Please try again later.');
//       }
//     };

//     fetchUserPlan();

//     // Check for successful payment
//     const urlParams = new URLSearchParams(window.location.search);
//     const paymentStatus = urlParams.get('payment');
//     const newPlan = urlParams.get('plan');

//     if (paymentStatus === 'success' && newPlan) {
//       setUserPlan(decodeURIComponent(newPlan));
//       // Clear the URL parameters
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   const handlePayment = async (planName: string, price: number): Promise<boolean> => {
//     try {
//       const amount = Math.round(price * 100);
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-checkout-session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ planName, amount }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create checkout session');
//       }

//       const { id: sessionId } = await response.json();
//       const stripe = await stripePromise;
//       if (!stripe) {
//         throw new Error('Failed to load Stripe');
//       }

//       const { error } = await stripe.redirectToCheckout({ sessionId });
//       if (error) {
//         throw new Error(error.message);
//       }

//       return true;
//     } catch (error) {
//       setError('An error occurred while processing your payment. Please try again.');
//       return false;
//     }
//   };

//   const handleGetStarted = async (planName: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/');
//         return;
//       }

//       if (userPlan === planName) {
//         router.push(`/${planName.toLowerCase()}`);
//       } else {
//         const plan = plans.find(p => p.name === planName);
//         if (!plan) {
//           throw new Error('Invalid plan selected');
//         }
        
//         const success = await handlePayment(planName, plan.price);
        
//         if (success) {
//           console.log('Payment successful');
//           setUserPlan(planName);
//         } else {
//           setError('Payment failed. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const plans: Plan[] = [
//     {
//       name: "Basic",
//       price: 9.99,
//       features: ["1 vCard", "Basic customization", "1GB storage", "Email support"],
//     },
//     {
//       name: "Pro",
//       price: 19.99,
//       features: ["5 vCards", "Advanced customization", "5GB storage", "Priority support", "Analytics dashboard"],
//     },
//     {
//       name: "Enterprise",
//       price: 0, // Custom pricing
//       features: ["Unlimited vCards", "Full customization", "Unlimited storage", "24/7 support", "Advanced analytics", "API access"],
//     },
//   ];

//   console.log(plans);

//   return (
//     <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
//       <div className="container px-4 md:px-6">
//         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">
//           Simple, Transparent Pricing
//         </h2>
//         {error && (
//           <div className="text-center mb-8">
//             <p className="text-red-500">{error}</p>
//             <button
//               onClick={() => window.location.href = '/'}
//               className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//             >
//               Go to Login
//             </button>
//           </div>
//         )}
//         {!userPlan   && !error && <p className="text-blue-500 text-center">Loading pricing options...</p>}
//         {userPlan && (
//           <div className="grid gap-8 md:grid-cols-3">
//             {plans.map((plan, index) => (
//               <div key={index} className={`rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col p-6 ${index === 1 ? 'border-indigo-600 border-2' : ''}`}>
//                 {index === 1 && (
//                   <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 w-fit mb-4 bg-indigo-600 text-white hover:bg-indigo-700">
//                     Most Popular
//                   </span>
//                 )}
//                 <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
//                 <p className="text-4xl font-bold mb-6 text-indigo-600">${plan.price}</p>
//                 <ul className="mb-6 space-y-2 flex-grow">
//                   {plan.features.map((feature, fIndex) => (
//                     <li key={fIndex} className="flex items-center text-gray-600">
//                       <Star className="w-4 h-4 mr-2 text-indigo-600" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   onClick={() => handleGetStarted(plan.name)}
//                   disabled={loading || userPlan === plan.name}
//                   className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
//                 >
//                   {userPlan === plan.name ? 'Current Plan' : 'Get Started'}
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-plan`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const amount = Math.round(price * 100);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planName, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { id: sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      setError('An error occurred while processing your payment. Please try again.');
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
      if (userPlan === planName) {
        router.push(`/${planName.toLowerCase()}`);
      } else {
        const plan = plans.find(p => p.name === planName);
        if (!plan) {
          throw new Error('Invalid plan selected');
        }
        
        const success = await handlePayment(planName, plan.price);
        
        if (success) {
          console.log('Payment successful');
          setUserPlan(planName);
        } else {
          setError('Please login first to process payment.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
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
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900">
          Simple, Transparent Pricing
        </h2>
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index} className={`rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col p-6 ${index === 1 ? 'border-indigo-600 border-2' : ''}`}>
              {index === 1 && (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 w-fit mb-4 bg-indigo-600 text-white hover:bg-indigo-700">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6 text-indigo-600">${plan.price}</p>
              <ul className="mb-6 space-y-2 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-indigo-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleGetStarted(plan.name)}
                disabled={loading || (isLoggedIn && userPlan === plan.name)}
                className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isLoggedIn && userPlan === plan.name ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}