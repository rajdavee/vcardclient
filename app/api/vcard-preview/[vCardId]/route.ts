import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest, { params }: { params: { vCardId: string } }) {
  try {
    const { vCardId } = params;
    const response = await axios.get(`${API_URL}/auth/vcard-preview/${vCardId}`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching vCard preview:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error fetching vCard preview' },
      { status: error.response?.status || 500 }
    );
  }
}