import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/basic', '/pro', '/premium']

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    // Redirect to login page if trying to access a protected route without a token
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (token && isProtectedRoute) {
    try {
      // Verify the token and get user info
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }

      const userData = await response.json()

      // Check if the user has access to the requested route based on their plan
      const path = request.nextUrl.pathname
      if (
        (path.startsWith('/basic') && userData.plan.toLowerCase() !== 'basic') ||
        (path.startsWith('/pro') && userData.plan.toLowerCase() !== 'pro') ||
        (path.startsWith('/premium') && userData.plan.toLowerCase() !== 'premium')
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('Middleware error:', error)
      // If there's an error verifying the token, redirect to login
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/basic/:path*', '/pro/:path*', '/premium/:path*'],
}