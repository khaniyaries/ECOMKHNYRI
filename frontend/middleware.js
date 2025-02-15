import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.pathname
  const isAdmin = request.cookies.get('isAdmin')

  // Admin route protection
  if (url.startsWith('/admin') && url !== '/admin' && !isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Valid paths check
  const validPaths = [
    '/',
    '/products',
    '/about',
    '/contact',
    '/admin'
  ]

  const isDynamicProductPath = url.match(/^\/products\/[\w-]+$/)
  const isSearchPath = url.startsWith('/products?')
  const isCategoryPath = url.startsWith('/products/category/')
  const isAdminPath = url.startsWith('/admin/')

  const isValidPath = 
    validPaths.includes(url) || 
    isDynamicProductPath ||
    isSearchPath ||
    isCategoryPath ||
    isAdminPath

  if (!isValidPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
