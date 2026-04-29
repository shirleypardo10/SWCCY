import type { Role } from "@/types/auth"
import type { ModuleKey } from "@/types/modules"
import type { PrivatePath } from "@/types/routes"

export type NavigationIconKey =
  | "dashboard"
  | "pedidos"
  | "produccion"
  | "entregasPagos"
  | "inventario"
  | "reportes"

export interface NavItem {
  id: string
  label: string
  href: PrivatePath
  icon: NavigationIconKey
  description: string
  moduleKey: ModuleKey | "dashboard"
  roles: Role[]
}
