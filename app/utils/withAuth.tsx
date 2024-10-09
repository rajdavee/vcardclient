import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define a generic type for components that can be wrapped
type WrappableComponent<P = {}> = React.ComponentType<P>;

export function withAuth<P extends object = {}>(
  WrappedComponent: WrappableComponent<P>, 
  requiredPlan: string = ''
): React.FC<P> {
  return function AuthComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      async function checkAuth() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-info`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            if (response.status === 403) {
              localStorage.removeItem('token');
              router.push('/');
              return;
            }
            const errorData = await response.json();
            console.error('Error fetching user info:', errorData);
            throw new Error(errorData.message || 'Failed to fetch user info');
          }

          const userData = await response.json();
          console.log('User plan:', userData.plan);

          setIsAuthenticated(true);

          // Check if plan is an object and has a 'name' property
          const userPlanName = typeof userData.plan === 'object' && userData.plan.name 
            ? userData.plan.name.toLowerCase() 
            : (typeof userData.plan === 'string' ? userData.plan.toLowerCase() : 'free');

          if (requiredPlan && userPlanName !== requiredPlan.toLowerCase()) {
            switch (userPlanName) {
              case 'basic':
                router.push('/basic');
                break;
              case 'pro':
                router.push('/pro');
                break;
              case 'premium':
                router.push('/premium');
                break;
              default:
                router.push('/home');
            }
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('token');
          router.push('/');
        }
      }

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
}