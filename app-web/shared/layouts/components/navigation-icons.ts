import {
  BarChart3,
  Boxes,
  ClipboardList,
  Gauge,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react"

import type { NavigationIconKey } from "@/types/navigation"

export const NAV_ICON_MAP: Record<NavigationIconKey, LucideIcon> = {
  dashboard: Gauge,
  pedidos: ClipboardList,
  produccion: PackageCheck,
  entregasPagos: Truck,
  inventario: Boxes,
  reportes: BarChart3,
}
