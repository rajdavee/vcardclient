'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const [status, setStatus] = useState('Processing...');
  const router = useRouter();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      confirmPayment(sessionId);
    } else {
      setStatus('Error: No session ID found');
    }
  }, []);

  const confirmPayment = async (sessionId: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'confirm-payment', sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStatus('Payment successful! Redirecting to home...');
          setTimeout(() => router.push('/home'), 3000);
        } else {
          setStatus(`Payment ${data.status}. Please contact support.`);
        }
      } else {
        setStatus('Error confirming payment. Please contact support.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setStatus('Error confirming payment. Please contact support.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}