export const ORDER_STATUS_VALUES = [
  "REGISTERED",
  "QUOTED",
  "APPROVED",
  "IN_PRODUCTION",
  "PRODUCTION_PAUSED",
  "PRODUCTION_COMPLETED",
  "DELIVERED",
  "CANCELLED",
] as const

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]

export const FURNITURE_TYPE_VALUES = ["ROPERO", "ZAPATERA", "COMODA", "OTRO"] as const
export type FurnitureType = (typeof FURNITURE_TYPE_VALUES)[number]

export const MEASUREMENT_UNIT_VALUES = ["CM", "M", "MM"] as const
export type MeasurementUnit = (typeof MEASUREMENT_UNIT_VALUES)[number]

export const PRODUCTION_STAGE_VALUES = [
  "CORTE",
  "CANTEADO",
  "ABISAGRADO",
  "ENSAMBLADO",
  "ACABADO",
] as const
export type ProductionStageName = (typeof PRODUCTION_STAGE_VALUES)[number]

export const PRODUCTION_STAGE_STATUS_VALUES = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "PAUSED",
] as const
export type ProductionStageStatus = (typeof PRODUCTION_STAGE_STATUS_VALUES)[number]

export const PAYMENT_METHOD_VALUES = ["CASH", "TRANSFER", "CARD", "YAPE", "PLIN", "OTHER"] as const
export type PaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number]

export const MATERIAL_UNIT_VALUES = ["UNIT", "METER", "BOARD", "KG", "LITER"] as const
export type MaterialUnit = (typeof MATERIAL_UNIT_VALUES)[number]
