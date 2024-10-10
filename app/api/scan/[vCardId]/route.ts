// vcard/app/api/scan/[vCardId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest, { params }: { params: { vCardId: string } }) {
  try {
    const { vCardId } = params;
    const ip = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent') || '';

    console.log(`Sending scan request for vCardId: ${vCardId}`);
    console.log('API_URL:', API_URL);

    const response = await axios.post(`${API_URL}/auth/scan/${vCardId}`, null, {
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': userAgent,
      },
    });

    console.log('Scan response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error recording scan:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error recording scan' },
      { status: error.response?.status || 500 }
    );
  }
}