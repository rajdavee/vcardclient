import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;
    const response = await axios.get(`${API_URL}/auth/public-vcard/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching public vCard:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || 'Error fetching vCard' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'Error fetching vCard' }, { status: 500 });
  }
}