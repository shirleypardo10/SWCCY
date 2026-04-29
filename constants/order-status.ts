import type { OrderStatus } from "@/types/order"

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  solicitud: "Solicitud",
  cotizacion: "Cotización",
  confirmado: "Confirmado",
  en_produccion: "En producción",
  listo_entrega: "Listo para entrega",
  entregado: "Entregado",
  cancelado: "Cancelado",
}
