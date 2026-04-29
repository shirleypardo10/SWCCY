import type { Role } from "@/types/auth"
import type { NavItem } from "@/types/navigation"
import { APP_ROUTES } from "@/routes/app-routes"

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    href: APP_ROUTES.dashboard,
    icon: "dashboard",
    description: "Resumen general según el rol autenticado",
    moduleKey: "dashboard",
    roles: ["cliente", "vendedor", "gerente", "produccion"],
  },
  {
    id: "nav-pedidos",
    label: "Gestión de Pedidos",
    href: APP_ROUTES.pedidos,
    icon: "pedidos",
    description: "Solicitudes, cotizaciones y seguimiento comercial",
    moduleKey: "pedidos",
    roles: ["cliente", "vendedor", "gerente", "produccion"],
  },
  {
    id: "nav-produccion",
    label: "Producción",
    href: APP_ROUTES.produccion,
    icon: "produccion",
    description: "Estados de fabricación de pedidos confirmados",
    moduleKey: "produccion",
    roles: ["produccion", "gerente"],
  },
  {
    id: "nav-entregas",
    label: "Entregas y Pagos",
    href: APP_ROUTES.entregasPagos,
    icon: "entregasPagos",
    description: "Programación de entrega y seguimiento de pagos",
    moduleKey: "entregasPagos",
    roles: ["vendedor", "gerente"],
  },
  {
    id: "nav-inventario",
    label: "Inventario",
    href: APP_ROUTES.inventario,
    icon: "inventario",
    description: "Control de stock de materiales e insumos",
    moduleKey: "inventario",
    roles: ["gerente"],
  },
  {
    id: "nav-reportes",
    label: "Reportes",
    href: APP_ROUTES.reportes,
    icon: "reportes",
    description: "Indicadores comerciales y de operación",
    moduleKey: "reportes",
    roles: ["gerente"],
  },
]

export function getNavigationByRole(role: Role): NavItem[] {
  return NAVIGATION_ITEMS.filter((item) => item.roles.includes(role))
}
