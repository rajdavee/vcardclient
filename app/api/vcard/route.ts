import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = request.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const response = await axios.post(`${API_URL}/auth/vcard`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
      },
    });

    // Include previewLink and qrCodeDataUrl in the response
    return NextResponse.json({
      ...response.data,
      previewLink: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview/${response.data.vCardId}`,
      qrCodeDataUrl: response.data.qrCodeDataUrl
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/vcard:', error);
    if (axios.isAxiosError(error)) {
      console.error('Backend error response:', error.response?.data);
      console.error('Backend error status:', error.response?.status);
      console.error('Backend error headers:', error.response?.headers);
      return NextResponse.json({ error: error.response?.data || 'Error creating vCard' }, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const vCardId = request.nextUrl.searchParams.get('id');
  const preview = request.nextUrl.searchParams.get('preview');
  
  try {
    let url = `${API_URL}/auth/vcards`;
    if (vCardId) {
      url = preview 
        ? `${API_URL}/auth/public-vcard-preview/${vCardId}`
        : `${API_URL}/auth/vcard/${vCardId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data?.error || 'Error fetching vCard(s)' }, { status: error.response?.status || 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const vCardId = request.nextUrl.searchParams.get('id');
    if (!vCardId) {
      return NextResponse.json({ error: 'vCard ID is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const response = await axios.put(`${API_URL}/auth/vcard/${vCardId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data?.error || 'Error updating vCard' }, { status: error.response?.status || 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const vCardId = request.nextUrl.searchParams.get('id');
    if (!vCardId) {
      return NextResponse.json({ error: 'vCard ID is required' }, { status: 400 });
    }

    const response = await axios.delete(`${API_URL}/auth/vcard/${vCardId}`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data?.error || 'Error deleting vCard' }, { status: error.response?.status || 500 });
  }
}