import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest, { params }: { params: { vCardId: string } }) {
  try {
    const { vCardId } = params;
    const { timeSpent } = await request.json();

    console.log(`Sending time spent request for vCardId: ${vCardId}`);
    console.log('API_URL:', API_URL);
    console.log('Time spent:', timeSpent);

    const response = await axios.post(`${API_URL}/auth/scan/${vCardId}/time-spent`, { timeSpent }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Time spent response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error recording time spent:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error recording time spent' },
      { status: error.response?.status || 500 }
    );
  }
}