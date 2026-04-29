import type { Role } from "@/types/auth"

export const ROLE_LABELS: Record<Role, string> = {
  cliente: "Cliente",
  vendedor: "Vendedor",
  gerente: "Gerente",
  produccion: "Producción",
}
