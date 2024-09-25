// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  // console.log({token}, request.nextUrl, request.url);
  
  // Check if the user is accessing a protected route
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if(token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')){
    console.log("entered");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

// Specify which routes should use this middleware
export const config = {
  matcher: ['/', '/register', '/login',], // Add more protected routes if needed
};
