// vcard/app/api/scan/[vCardId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest, { params }: { params: { vCardId: string } }) {
  const { vCardId } = params;
  const ip = request.headers.get('x-forwarded-for') || request.ip;
  const userAgent = request.headers.get('user-agent') || '';

  try {
    console.log(`Handling scan for vCardId: ${vCardId}`);
    const response = await axios.post(`${API_URL}/auth/scan/${vCardId}`, {
      ip,
      userAgent
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.data.success) { 
      throw new Error('Failed to record scan');
    }

    console.log('Scan recorded successfully');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview?vCardId=${vCardId}`);
  } catch (error) {
    console.error('Error handling scan:', error);
    return NextResponse.json({ error: 'Failed to handle scan' }, { status: 500 });
  }
}