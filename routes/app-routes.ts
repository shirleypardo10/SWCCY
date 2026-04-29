import type { Role } from "@/types/auth"
import type { AppRouteMeta, PrivatePath } from "@/types/routes"

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  forbidden: "/403",
  dashboard: "/dashboard",
  pedidos: "/pedidos",
  produccion: "/produccion",
  entregasPagos: "/entregas-pagos",
  inventario: "/inventario",
  reportes: "/reportes",
} as const

export const PRIVATE_ROUTE_PATHS: PrivatePath[] = [
  APP_ROUTES.dashboard,
  APP_ROUTES.pedidos,
  APP_ROUTES.produccion,
  APP_ROUTES.entregasPagos,
  APP_ROUTES.inventario,
  APP_ROUTES.reportes,
]

export const ROUTES_META: AppRouteMeta[] = [
  {
    path: APP_ROUTES.home,
    label: "Inicio",
    isPublic: true,
    allowedRoles: ["cliente", "vendedor", "gerente", "produccion"],
    description: "Resolución automática de acceso por sesión",
  },
  {
    path: APP_ROUTES.login,
    label: "Iniciar sesión",
    isPublic: true,
    allowedRoles: ["cliente", "vendedor", "gerente", "produccion"],
    description: "Acceso al sistema comercial",
  },
  {
    path: APP_ROUTES.forbidden,
    label: "Acceso denegado",
    isPublic: true,
    allowedRoles: ["cliente", "vendedor", "gerente", "produccion"],
    description: "Ruta 403 por falta de permisos",
  },
  {
    path: APP_ROUTES.dashboard,
    label: "Dashboard",
    isPublic: false,
    allowedRoles: ["cliente", "vendedor", "gerente", "produccion"],
    moduleKey: "dashboard",
    description: "Resumen principal por rol",
  },
  {
    path: APP_ROUTES.pedidos,
    label: "Gestión de Pedidos",
    isPublic: false,
    allowedRoles: ["cliente", "vendedor", "gerente", "produccion"],
    moduleKey: "pedidos",
    description: "Control de solicitudes, cotizaciones y pedidos",
  },
  {
    path: APP_ROUTES.produccion,
    label: "Producción",
    isPublic: false,
    allowedRoles: ["produccion", "gerente"],
    moduleKey: "produccion",
    description: "Seguimiento de fabricación por estado",
  },
  {
    path: APP_ROUTES.entregasPagos,
    label: "Entregas y Pagos",
    isPublic: false,
    allowedRoles: ["vendedor", "gerente"],
    moduleKey: "entregasPagos",
    description: "Coordinación de entrega y control de pagos",
  },
  {
    path: APP_ROUTES.inventario,
    label: "Inventario",
    isPublic: false,
    allowedRoles: ["gerente"],
    moduleKey: "inventario",
    description: "Visualización de stock y necesidades de insumos",
  },
  {
    path: APP_ROUTES.reportes,
    label: "Reportes",
    isPublic: false,
    allowedRoles: ["gerente"],
    moduleKey: "reportes",
    description: "Indicadores estratégicos y desempeño comercial",
  },
]

const routeMetaByPath = new Map<string, AppRouteMeta>(
  ROUTES_META.map((item) => [item.path, item])
)

export function getRouteMeta(pathname: string): AppRouteMeta | undefined {
  const normalizedPath = normalizePath(pathname)
  return routeMetaByPath.get(normalizedPath)
}

export function getAllowedRolesForPath(pathname: string): Role[] {
  return getRouteMeta(pathname)?.allowedRoles ?? []
}

export function isProtectedPath(pathname: string): boolean {
  const normalizedPath = normalizePath(pathname)
  return PRIVATE_ROUTE_PATHS.includes(normalizedPath as PrivatePath)
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }

  return pathname
}
