import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request:NextRequest){
    const path =request.nextUrl.pathname;

    const isauthPath = path === '/login' || path === '/signup'||path==='verifyemail'
    const token = request.cookies.get('token')?.value || ''
    const isProtectedPath = path.startsWith('/profile');

    if(isauthPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

}


// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgotpassword',
    '/resetpassword'
  ]
}