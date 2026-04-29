export const ORDER_STATUS_VALUES = [
  "solicitud",
  "cotizacion",
  "confirmado",
  "en_produccion",
  "listo_entrega",
  "entregado",
  "cancelado",
] as const

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]
