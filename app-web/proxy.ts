import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_KEY } from "@/config/auth"
import {
  APP_ROUTES,
  getAllowedRolesForPath,
  isProtectedPath,
  normalizePath,
} from "@/routes/app-routes"
import { hasRoleAccess } from "@/utils/rbac"
import { parseSessionToken } from "@/utils/session"

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL(APP_ROUTES.login, request.url)
  loginUrl.searchParams.set("redirect", pathname)
  return NextResponse.redirect(loginUrl)
}

export function proxy(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname)
  const token = request.cookies.get(AUTH_COOKIE_KEY)?.value
  const session = parseSessionToken(token)

  if (pathname === APP_ROUTES.login && session) {
    return NextResponse.redirect(new URL(APP_ROUTES.dashboard, request.url))
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!session) {
    return redirectToLogin(request, pathname)
  }

  const allowedRoles = getAllowedRolesForPath(pathname)

  if (allowedRoles.length > 0 && !hasRoleAccess(session.role, allowedRoles)) {
    return NextResponse.redirect(new URL(APP_ROUTES.forbidden, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/pedidos/:path*",
    "/produccion/:path*",
    "/entregas-pagos/:path*",
    "/inventario/:path*",
    "/reportes/:path*",
  ],
}
