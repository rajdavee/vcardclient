import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

interface PaymentSuccessBody {
  sessionId: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PaymentSuccessBody = await req.json();
    console.log('Received payment success body:', body);

    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update user subscription status
      await updateUserSubscription(session.customer as string);

      return NextResponse.json({ message: 'Payment successful' });
    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment success:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the payment' },
      { status: 500 }
    );
  }
}

async function updateUserSubscription(customerId: string): Promise<void> {
  // Implement the logic to update the user's subscription status
  // This might involve updating a database record, for example
  console.log(`Updating subscription for customer: ${customerId}`);
  // Add your actual implementation here
}