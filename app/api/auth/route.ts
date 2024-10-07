import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    let action: string | null = null;
    let data: any = {};

    console.log('Content-Type:', contentType);

    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      action = formData.get('action') as string;
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
      const jsonData = await request.json();
      action = jsonData.action;
      data = jsonData;
      console.log('Received JSON data:', jsonData);
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
        // These actions use default POST method
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
            // Remove the Content-Type header as it will be set automatically for FormData
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}:`, errorText);
      return NextResponse.json({ error: errorText || `API error: ${response.status}` }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}