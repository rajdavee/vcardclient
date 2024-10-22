import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(`${API_URL}/auth/vcards`, {
      headers: {
        'Authorization': token,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching vCards:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error fetching vCards' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await req.json();
    const { vCardId, ...vCardData } = updateData;

    const response = await axios.put(`${API_URL}/auth/vcard/${vCardId}`, vCardData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating vCard:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error updating vCard' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vCardId } = await req.json();

    const response = await axios.delete(`${API_URL}/auth/vcard/${vCardId}`, {
      headers: {
        'Authorization': token,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error deleting vCard:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Error deleting vCard' },
      { status: error.response?.status || 500 }
    );
  }
}