import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.pathname

  const validPaths = [
    '/',
    '/products',
    '/about',
    '/contact'
  ]

  const isDynamicProductPath = url.match(/^\/products\/[\w-]+$/)
  const isSearchPath = url.startsWith('/products?')
  const isCategoryPath = url.startsWith('/products/category/')

  const isValidPath = 
    validPaths.includes(url) || 
    isDynamicProductPath ||
    isSearchPath ||
    isCategoryPath

  if (!isValidPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
