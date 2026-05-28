import type { Role } from "@/types/auth"
import type {
  FurnitureType,
  MaterialUnit,
  OrderStatus,
  PaymentMethod,
  ProductionStageName,
  ProductionStageStatus,
} from "@/types/order"

export type ProductionStatus = "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED"
export type InventoryMovementType = "IN" | "OUT" | "ADJUSTMENT"

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  REGISTERED: "Registrado",
  QUOTED: "Cotizado",
  APPROVED: "Aprobado",
  IN_PRODUCTION: "En producción",
  PRODUCTION_PAUSED: "Producción pausada",
  PRODUCTION_COMPLETED: "Producción completada",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
}

export const FURNITURE_TYPE_LABELS: Record<FurnitureType, string> = {
  ROPERO: "Ropero",
  ZAPATERA: "Zapatera",
  COMODA: "Cómoda",
  OTRO: "Otro mueble",
}

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En proceso",
  PAUSED: "Pausada",
  COMPLETED: "Completada",
}

export const PRODUCTION_STAGE_LABELS: Record<ProductionStageName, string> = {
  CORTE: "Corte",
  CANTEADO: "Canteado",
  ABISAGRADO: "Abisagrado",
  ENSAMBLADO: "Ensamblado",
  ACABADO: "Acabado",
}

export const PRODUCTION_STAGE_STATUS_LABELS: Record<ProductionStageStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En proceso",
  COMPLETED: "Completada",
  PAUSED: "Pausada",
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  YAPE: "Yape",
  PLIN: "Plin",
  OTHER: "Otro",
}

export const MATERIAL_UNIT_LABELS: Record<MaterialUnit, string> = {
  UNIT: "Unidad",
  METER: "Metro",
  BOARD: "Tablero",
  KG: "Kilogramo",
  LITER: "Litro",
}

export const INVENTORY_MOVEMENT_TYPE_LABELS: Record<InventoryMovementType, string> = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUSTMENT: "Ajuste",
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  GERENTE: "Gerente",
  VENDEDOR: "Vendedor",
  PRODUCTOR: "Producción",
  ALMACENERO: "Almacén",
}

export function toOptions<T extends string>(
  values: readonly T[],
  labels: Record<T, string>
): SelectOption<T>[] {
  return values.map((value) => ({ value, label: labels[value] }))
}

