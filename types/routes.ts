import type { Role } from "@/types/auth"
import type { ModuleKey } from "@/types/modules"

export type PublicPath = "/" | "/login" | "/403"

export type PrivatePath =
  | "/dashboard"
  | "/pedidos"
  | "/produccion"
  | "/entregas-pagos"
  | "/inventario"
  | "/reportes"

export type AppPath = PublicPath | PrivatePath

export interface AppRouteMeta {
  path: AppPath
  label: string
  isPublic: boolean
  allowedRoles: Role[]
  moduleKey?: ModuleKey | "dashboard"
  description: string
}
