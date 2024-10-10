// vcard/app/api/scan/[vCardId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { vCardId: string } }) {
  const { vCardId } = params;

  try {
    console.log(`Handling scan for vCardId: ${vCardId}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/scan/${vCardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to record scan');
    }

    console.log('Scan recorded successfully');
    // Redirect to the preview page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview/${vCardId}`);
  } catch (error) {
    console.error('Error handling scan:', error);
    return NextResponse.json({ error: 'Failed to handle scan' }, { status: 500 });
  }
}