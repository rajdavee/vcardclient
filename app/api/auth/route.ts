import { NextResponse } from 'next/server';

interface AuthRequestBody {
  email?: string;
  password?: string;
  action: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    console.log('POST request received');
    const contentType = request.headers.get('content-type');
    let action: string | null = null;
    let data: AuthRequestBody;

    console.log('Content-Type:', contentType);

    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      action = formData.get('action') as string;
      data = { action };
      for (const [key, value] of Array.from(formData.entries())) {
        if (typeof value === 'string') {
          data[key] = value;
        } else {
          // Handle File objects if needed
          data[key] = value;
        }
      }
      console.log('Received FormData:', data);
    } else {
      data = await request.json();
      action = data.action;
      console.log('Received JSON data:', data);
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${action}`;
    let method = 'POST';
    let body: FormData | string | undefined;
    
    const headers: HeadersInit = {
      'Authorization': request.headers.get('Authorization') || '',
    };

    // Handle different actions
    switch (action) {
      case 'register':
      case 'login':
      case 'forgot-password':
        body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
        break;
      case 'reset-password':
        const { token, password } = data;
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password/${token}`;
        body = JSON.stringify({ password });
        headers['Content-Type'] = 'application/json';
        break;
      case 'getUser':
      case 'user-info':
      case 'getVCards':
        method = 'GET';
        body = undefined;
        break;
      case 'createVCard':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/vcard`;
        method = 'POST';
        if (request instanceof Request) {
          const formData = await request.formData();
          body = formData;
          delete headers['Content-Type'];
        } else {
          return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
        }
        break;
      case 'updateVCard':
        const { vCardId, ...vCardData } = data;
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/vcard/${vCardId}`;
        method = 'PUT';
        body = JSON.stringify(vCardData);
        headers['Content-Type'] = 'application/json';
        break;
      case 'getVCard':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/vcard/${data.vCardId}`;
        method = 'GET';
        body = undefined;
        break;
      case 'getPublicVCard':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public-vcard/${data.vCardId}`;
        method = 'GET';
        body = undefined;
        break;
      case 'uploadChunk':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/upload-chunk`;
        method = 'POST';
        if (data instanceof FormData) {
          body = data;
        } else {
          return NextResponse.json({ error: 'Invalid data format for file upload' }, { status: 400 });
        }
        break;
      case 'user-plan':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/user-plan`;
        method = 'GET';
        body = undefined;
        break;
      case 'create-checkout-session':
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-checkout-session`;
        method = 'POST';
        body = JSON.stringify({ planName: data.planName, amount: data.amount });
        headers['Content-Type'] = 'application/json';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log(`Sending request to: ${endpoint}`);
    console.log(`Method: ${method}`);
    console.log(`Headers:`, headers);
    console.log(`Body:`, body);

    const response = await fetch(endpoint, {
      method,
      headers,
      body,
    });

    console.log(`Received response with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}:`, errorText);
      return NextResponse.json({ error: errorText || `API error: ${response.status}` }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('API route error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    }
    return NextResponse.json({ 
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/api/auth/verify-email')) {
    const token = path.split('/').pop();
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email/${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return NextResponse.json(data);
      } else {
        return NextResponse.json({ error: data.error || 'Email verification failed' }, { status: response.status });
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return NextResponse.json({ error: 'An error occurred during verification' }, { status: 500 });
    }
  }

  // Handle other GET requests if needed
  return NextResponse.json({ error: 'Invalid GET request' }, { status: 400 });
}