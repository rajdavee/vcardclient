import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; exp: number };

    if (!decoded.userId || Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json({ userId: decoded.userId });
  } catch (err) {
    console.error('Error verifying token:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}