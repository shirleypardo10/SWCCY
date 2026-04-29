import { ORDER_STATUS_LABELS } from "@/constants/order-status"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types/order"

const statusStyles: Record<OrderStatus, string> = {
  solicitud: "border border-slate-300 bg-slate-100 text-slate-700",
  cotizacion: "border border-amber-300 bg-amber-100 text-amber-800",
  confirmado: "border border-sky-300 bg-sky-100 text-sky-800",
  en_produccion: "border border-indigo-300 bg-indigo-100 text-indigo-800",
  listo_entrega: "border border-teal-300 bg-teal-100 text-teal-800",
  entregado: "border border-emerald-300 bg-emerald-100 text-emerald-800",
  cancelado: "border border-rose-300 bg-rose-100 text-rose-800",
}

export function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
      aria-label={`Estado ${ORDER_STATUS_LABELS[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}
