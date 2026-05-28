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
    roles: ["ADMIN", "GERENTE", "VENDEDOR", "PRODUCTOR", "ALMACENERO"],
  },
  {
    id: "nav-pedidos",
    label: "Gestión de Pedidos",
    href: APP_ROUTES.pedidos,
    icon: "pedidos",
    description: "Solicitudes, cotizaciones y seguimiento comercial",
    moduleKey: "pedidos",
    roles: ["ADMIN", "GERENTE", "VENDEDOR", "PRODUCTOR"],
  },
  {
    id: "nav-produccion",
    label: "Producción",
    href: APP_ROUTES.produccion,
    icon: "produccion",
    description: "Estados de fabricación de pedidos confirmados",
    moduleKey: "produccion",
    roles: ["ADMIN", "GERENTE", "PRODUCTOR"],
  },
  {
    id: "nav-entregas",
    label: "Entregas y Pagos",
    href: APP_ROUTES.entregasPagos,
    icon: "entregasPagos",
    description: "Programación de entrega y seguimiento de pagos",
    moduleKey: "entregasPagos",
    roles: ["ADMIN", "GERENTE", "VENDEDOR"],
  },
  {
    id: "nav-inventario",
    label: "Inventario",
    href: APP_ROUTES.inventario,
    icon: "inventario",
    description: "Control de stock de materiales e insumos",
    moduleKey: "inventario",
    roles: ["ADMIN", "GERENTE", "ALMACENERO"],
  },
  {
    id: "nav-reportes",
    label: "Reportes",
    href: APP_ROUTES.reportes,
    icon: "reportes",
    description: "Indicadores comerciales y de operación",
    moduleKey: "reportes",
    roles: ["ADMIN", "GERENTE"],
  },
]

export function getNavigationByRole(role: Role): NavItem[] {
  return NAVIGATION_ITEMS.filter((item) => item.roles.includes(role))
}
