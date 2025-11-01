import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Defina suas rotas com mais precisão
  const isPublicRoute = pathname === '/login' || pathname === '/';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // --- Lógica de Redirecionamento ---

  // 1. Se NÃO tem token e está tentando acessar uma rota protegida
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Se TEM token e está tentando acessar uma rota pública (como /login)
  if (token && isPublicRoute) {
    // Redireciona para o dashboard
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Em todos os outros casos, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
