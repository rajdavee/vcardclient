import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.redirect(new URL('/dashboard?payment=error&message=No session ID provided', request.url));
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/payment-success?session_id=${session_id}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(responseData));
    }

    if (responseData.success) {
      return NextResponse.redirect(new URL(`/dashboard?payment=success&plan=${encodeURIComponent(responseData.planName)}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/dashboard?payment=error&message=${encodeURIComponent(JSON.stringify(responseData))}`, request.url));
    }
  } catch (error: any) {
    return NextResponse.redirect(new URL(`/dashboard?payment=error&message=${encodeURIComponent(error.message)}`, request.url));
  }
}