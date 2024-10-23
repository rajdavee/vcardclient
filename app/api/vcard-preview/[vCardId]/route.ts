import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest, { params }: { params: { vCardId: string } }) {
  try {
    const { vCardId } = params;
    const ip = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent') || '';

    console.log(`Fetching preview for vCardId: ${vCardId}`);
    console.log('IP Address:', ip);
    console.log('User Agent:', userAgent);

    const response = await axios.get(`${API_URL}/auth/vcard-preview/${vCardId}`, {
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': userAgent,
      },
    });

    console.log('Preview data fetched successfully');
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching vcard preview:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error fetching vCard preview' },
      { status: error.response?.status || 500 }
    );
  }
}