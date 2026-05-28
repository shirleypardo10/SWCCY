"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BadgeDollarSign,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileBarChart2,
  PackageCheck,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Truck,
  UserPlus,
  WalletCards,
} from "lucide-react"

import {
  FURNITURE_TYPE_LABELS,
  INVENTORY_MOVEMENT_TYPE_LABELS,
  MATERIAL_UNIT_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PRODUCTION_STAGE_LABELS,
  PRODUCTION_STAGE_STATUS_LABELS,
  PRODUCTION_STATUS_LABELS,
  ROLE_LABELS,
  toOptions,
  type InventoryMovementType,
  type ProductionStatus,
  type SelectOption,
} from "@/constants/domain-labels"
import { apiRequest, type ApiListMeta } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHeader } from "@/shared/components/ui"
import { StatusChip } from "@/shared/components/ui/status-chip"
import type { Role } from "@/types/auth"
import type {
  FurnitureType,
  MaterialUnit,
  OrderStatus,
  PaymentMethod,
  ProductionStageName,
  ProductionStageStatus,
} from "@/types/order"

type ApiId = { _id: string }
type Customer = ApiId & { fullName: string; documentNumber: string; phone?: string; email?: string }
type Material = ApiId & {
  name: string
  unit: MaterialUnit
  currentStock: number
  minimumStock: number
  unitCost: number
}
type Order = ApiId & {
  trackingCode: string
  customerId: Customer | string
  furnitureType: FurnitureType
  quantity: number
  status: OrderStatus
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  observations?: string
}
type ProductionStage = {
  name: ProductionStageName
  status: ProductionStageStatus
  observations?: string
}
type Production = ApiId & {
  orderId: Order | string
  status: ProductionStatus
  currentStage?: ProductionStageName
  progressPercentage: number
  stages: ProductionStage[]
}
type Payment = ApiId & {
  orderId: Order | string
  amount: number
  method: PaymentMethod
  paymentType: "PARTIAL" | "TOTAL"
  paymentDate: string
}
type User = ApiId & { fullName: string; email: string; role: Role; isActive: boolean }

const furnitureTypes: FurnitureType[] = ["ROPERO", "ZAPATERA", "COMODA", "OTRO"]
const orderStatuses: OrderStatus[] = [
  "REGISTERED",
  "QUOTED",
  "APPROVED",
  "IN_PRODUCTION",
  "PRODUCTION_PAUSED",
  "PRODUCTION_COMPLETED",
  "DELIVERED",
  "CANCELLED",
]
const productionStages: ProductionStageName[] = ["CORTE", "CANTEADO", "ABISAGRADO", "ENSAMBLADO", "ACABADO"]
const stageStatuses: ProductionStageStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "PAUSED"]
const paymentMethods: PaymentMethod[] = ["CASH", "TRANSFER", "CARD", "YAPE", "PLIN", "OTHER"]
const materialUnits: MaterialUnit[] = ["UNIT", "METER", "BOARD", "KG", "LITER"]
const movementTypes: InventoryMovementType[] = ["IN", "OUT", "ADJUSTMENT"]
const roles: Role[] = ["ADMIN", "GERENTE", "VENDEDOR", "PRODUCTOR", "ALMACENERO"]

const furnitureOptions = toOptions(furnitureTypes, FURNITURE_TYPE_LABELS)
const orderStatusOptions = toOptions(orderStatuses, ORDER_STATUS_LABELS)
const stageStatusOptions = toOptions(stageStatuses, PRODUCTION_STAGE_STATUS_LABELS)
const paymentMethodOptions = toOptions(paymentMethods, PAYMENT_METHOD_LABELS)
const materialUnitOptions = toOptions(materialUnits, MATERIAL_UNIT_LABELS)
const movementTypeOptions = toOptions(movementTypes, INVENTORY_MOVEMENT_TYPE_LABELS)
const roleOptions = toOptions(roles, ROLE_LABELS)

function getOrderCustomerName(order: Order) {
  return typeof order.customerId === "string" ? "Cliente sin cargar" : order.customerId.fullName
}

function money(value: number | undefined) {
  return `S/ ${(value ?? 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function ModuleShell({
  title,
  description,
  icon: Icon,
  rightSlot,
  children,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  rightSlot?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        rightSlot={
          rightSlot ?? (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
          )
        }
      />
      {children}
    </section>
  )
}

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
}: {
  title: string
  value: string
  helper: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "neutral" | "success" | "warning" | "info"
}) {
  const toneClass = {
    neutral: "bg-card",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-sky-50 border-sky-200",
  }[tone]

  return (
    <Card className={cn("border shadow-sm", toneClass)}>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-background/80 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function LabeledSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (value: T | "") => void
  options: SelectOption<T>[]
  placeholder?: string
}) {
  return (
    <select
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value as T | "")}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function InlineAlert({ message, type = "info" }: { message: string | null; type?: "success" | "error" | "info" }) {
  if (!message) return null
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  }[type]
  return <div className={cn("rounded-md border px-3 py-2 text-sm", styles)}>{message}</div>
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function ProductionStatusBadge({ status }: { status: ProductionStatus }) {
  return (
    <Badge variant="outline" className="bg-background">
      {PRODUCTION_STATUS_LABELS[status]}
    </Badge>
  )
}

export function PedidosModule() {
  const [orders, setOrders] = useState<Order[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [meta, setMeta] = useState<ApiListMeta | undefined>()
  const [filters, setFilters] = useState({ customerName: "", documentNumber: "", status: "", trackingCode: "" })
  const [form, setForm] = useState({
    fullName: "",
    documentNumber: "",
    phone: "",
    email: "",
    furnitureType: "ROPERO",
    quantity: "1",
    width: "120",
    height: "180",
    depth: "55",
    materialId: "",
    observations: "",
  })
  const [quote, setQuote] = useState({ orderId: "", laborCost: "250", additionalCost: "0", taxRate: "0.18" })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [ordersResult, materialsResult] = await Promise.all([
      apiRequest<Order[]>("/orders", { query: { ...filters, limit: 50 } }),
      apiRequest<Material[]>("/materials"),
    ])
    setOrders(ordersResult.data)
    setMeta(ordersResult.meta)
    setMaterials(materialsResult.data)
  }, [filters])

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar los pedidos"))
  }, [load])

  const quotePreview = useMemo(() => {
    const order = orders.find((item) => item._id === quote.orderId)
    const subtotal = Number(quote.laborCost) + Number(quote.additionalCost) + (order?.totalAmount ?? 0)
    return {
      order,
      subtotal,
      tax: subtotal * Number(quote.taxRate),
      total: subtotal * (1 + Number(quote.taxRate)),
    }
  }, [orders, quote])

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await apiRequest<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            documentType: "DNI",
            documentNumber: form.documentNumber,
            fullName: form.fullName,
            phone: form.phone,
            email: form.email || undefined,
          },
          furnitureType: form.furnitureType,
          quantity: Number(form.quantity),
          measurements: {
            width: Number(form.width),
            height: Number(form.height),
            depth: Number(form.depth),
            unit: "CM",
          },
          materialIds: form.materialId ? [form.materialId] : [],
          observations: form.observations || undefined,
        }),
      })
      setMessage("Pedido registrado correctamente")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pedido")
    }
  }

  const generateQuote = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await apiRequest(`/quotations/order/${quote.orderId}/generate`, {
        method: "POST",
        body: JSON.stringify({
          laborCost: Number(quote.laborCost),
          additionalCost: Number(quote.additionalCost),
          taxRate: Number(quote.taxRate),
        }),
      })
      setMessage("Cotización generada y pedido actualizado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar la cotización")
    }
  }

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setError(null)
    try {
      await apiRequest(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
      setMessage("Estado actualizado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el estado")
    }
  }

  return (
    <ModuleShell
      title="Gestión de pedidos"
      description="Registra solicitudes, cotiza muebles personalizados y consulta el avance comercial."
      icon={ClipboardList}
    >
      <InlineAlert message={message} type="success" />
      <InlineAlert message={error} type="error" />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Pedidos listados" value={String(meta?.total ?? orders.length)} helper="Según filtros activos" icon={ClipboardList} tone="info" />
        <MetricCard title="Valor cotizado" value={money(orders.reduce((sum, order) => sum + order.totalAmount, 0))} helper="Total acumulado visible" icon={BadgeDollarSign} tone="success" />
        <MetricCard title="Saldos pendientes" value={money(orders.reduce((sum, order) => sum + order.pendingAmount, 0))} helper="Por cobrar en pedidos visibles" icon={WalletCards} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Registrar nuevo pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitOrder} className="space-y-4">
              <FormSection title="Datos del cliente" description="Información necesaria para identificar y contactar al solicitante.">
                <Field label="Nombre completo"><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Field>
                <Field label="DNI o RUC"><Input value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} required /></Field>
                <Field label="Teléfono"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></Field>
                <Field label="Correo electrónico"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              </FormSection>
              <FormSection title="Mueble personalizado" description="Define el tipo de producto, cantidad y material base.">
                <Field label="Tipo de mueble"><LabeledSelect value={form.furnitureType} onChange={(value) => setForm({ ...form, furnitureType: value || "ROPERO" })} options={furnitureOptions} /></Field>
                <Field label="Cantidad"><Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field>
                <Field label="Material principal"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.materialId} onChange={(event) => setForm({ ...form, materialId: event.target.value })}><option value="">Sin material asignado</option>{materials.map((material) => <option key={material._id} value={material._id}>{material.name}</option>)}</select></Field>
                <Field label="Observaciones"><Textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} /></Field>
              </FormSection>
              <FormSection title="Medidas" description="Registra las dimensiones en centímetros.">
                <Field label="Ancho"><Input type="number" min="1" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} /></Field>
                <Field label="Alto"><Input type="number" min="1" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Field>
                <Field label="Fondo"><Input type="number" min="1" value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} /></Field>
                <div className="flex items-end"><Button className="w-full"><Plus className="mr-2 h-4 w-4" />Registrar pedido</Button></div>
              </FormSection>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generar cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateQuote} className="space-y-3">
              <Field label="Pedido"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={quote.orderId} onChange={(event) => setQuote({ ...quote, orderId: event.target.value })}><option value="">Seleccionar pedido</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.trackingCode} - {getOrderCustomerName(order)}</option>)}</select></Field>
              <Field label="Mano de obra"><Input type="number" value={quote.laborCost} onChange={(e) => setQuote({ ...quote, laborCost: e.target.value })} /></Field>
              <Field label="Costo adicional"><Input type="number" value={quote.additionalCost} onChange={(e) => setQuote({ ...quote, additionalCost: e.target.value })} /></Field>
              <Field label="IGV"><Input type="number" step="0.01" value={quote.taxRate} onChange={(e) => setQuote({ ...quote, taxRate: e.target.value })} /></Field>
              <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                <div className="flex justify-between"><span>Base estimada</span><span>{money(quotePreview.subtotal)}</span></div>
                <div className="flex justify-between"><span>IGV</span><span>{money(quotePreview.tax)}</span></div>
                <div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total estimado</span><span>{money(quotePreview.total)}</span></div>
              </div>
              <Button className="w-full" disabled={!quote.orderId}><BadgeDollarSign className="mr-2 h-4 w-4" />Generar cotización</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consulta y seguimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_220px_auto]">
            <Input placeholder="Buscar por cliente" value={filters.customerName} onChange={(e) => setFilters({ ...filters, customerName: e.target.value })} />
            <Input placeholder="Documento" value={filters.documentNumber} onChange={(e) => setFilters({ ...filters, documentNumber: e.target.value })} />
            <Input placeholder="Código de seguimiento" value={filters.trackingCode} onChange={(e) => setFilters({ ...filters, trackingCode: e.target.value })} />
            <LabeledSelect value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={orderStatusOptions} placeholder="Todos los estados" />
            <Button type="button" variant="outline" onClick={load}><Search className="mr-2 h-4 w-4" />Buscar</Button>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground"><tr><th className="px-3 py-2">Código</th><th>Cliente</th><th>Mueble</th><th>Total</th><th>Saldo</th><th>Estado</th><th>Actualizar estado</th></tr></thead>
              <tbody>{orders.map((order) => <tr key={order._id} className="border-t"><td className="px-3 py-2 font-medium">{order.trackingCode}</td><td>{getOrderCustomerName(order)}</td><td>{FURNITURE_TYPE_LABELS[order.furnitureType]} x{order.quantity}</td><td>{money(order.totalAmount)}</td><td>{money(order.pendingAmount)}</td><td><StatusChip status={order.status} /></td><td className="py-2 pr-3"><LabeledSelect value={order.status} onChange={(value) => value && updateStatus(order._id, value)} options={orderStatusOptions} /></td></tr>)}</tbody>
            </table>
            {orders.length === 0 ? <EmptyPanel title="Sin pedidos registrados" description="Cuando registres pedidos aparecerán en esta tabla." /> : null}
          </div>
        </CardContent>
      </Card>
    </ModuleShell>
  )
}

export function ProduccionModule() {
  const [orders, setOrders] = useState<Order[]>([])
  const [productions, setProductions] = useState<Production[]>([])
  const [selectedOrder, setSelectedOrder] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [ordersResult, productionsResult] = await Promise.all([
      apiRequest<Order[]>("/orders", { query: { limit: 100 } }),
      apiRequest<Production[]>("/production"),
    ])
    setOrders(ordersResult.data)
    setProductions(productionsResult.data)
  }, [])

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar producción"))
  }, [load])

  const patchProduction = async (path: string, success: string, body?: unknown) => {
    try {
      await apiRequest(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined })
      setMessage(success)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar producción")
    }
  }

  const start = async () => {
    if (!selectedOrder) return
    await patchProduction(`/production/order/${selectedOrder}/start`, "Producción iniciada", { comment: "Inicio desde frontend" })
    setSelectedOrder("")
  }

  const candidates = orders.filter((order) => ["QUOTED", "APPROVED"].includes(order.status))
  const completed = productions.filter((production) => production.status === "COMPLETED").length

  return (
    <ModuleShell title="Producción" description="Administra fabricación por pedido, etapa y avance real." icon={Factory}>
      <InlineAlert message={message} type="success" />
      <InlineAlert message={error} type="error" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Órdenes activas" value={String(productions.length)} helper="Fabricaciones registradas" icon={Factory} tone="info" />
        <MetricCard title="Completadas" value={String(completed)} helper="Listas para entrega" icon={CheckCircle2} tone="success" />
        <MetricCard title="Por iniciar" value={String(candidates.length)} helper="Cotizadas o aprobadas" icon={Play} tone="warning" />
      </div>
      <Card>
        <CardHeader><CardTitle>Iniciar fabricación</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_auto]">
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={selectedOrder} onChange={(event) => setSelectedOrder(event.target.value)}>
            <option value="">Selecciona un pedido cotizado o aprobado</option>
            {candidates.map((order) => <option key={order._id} value={order._id}>{order.trackingCode} - {getOrderCustomerName(order)} - {ORDER_STATUS_LABELS[order.status]}</option>)}
          </select>
          <Button onClick={start} disabled={!selectedOrder}><Play className="mr-2 h-4 w-4" />Iniciar producción</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {productions.map((production) => {
          const order = typeof production.orderId === "string" ? null : production.orderId
          const canPause = production.status === "IN_PROGRESS"
          const canResume = production.status === "PAUSED"
          const canComplete = production.status === "IN_PROGRESS" && production.progressPercentage === 100
          return (
            <Card key={production._id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                  <span>{order?.trackingCode ?? "Orden de producción"}</span>
                  <ProductionStatusBadge status={production.status} />
                </CardTitle>
                <p className="text-sm text-muted-foreground">{order ? getOrderCustomerName(order) : "Pedido no cargado"} · Etapa actual: {production.currentStage ? PRODUCTION_STAGE_LABELS[production.currentStage] : "Sin etapa"}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Avance de fabricación</span><span className="font-semibold">{production.progressPercentage}%</span></div>
                  <Progress value={production.progressPercentage} className="h-2" />
                </div>
                <div className="space-y-2">
                  {production.stages.map((stage) => (
                    <div key={stage.name} className="grid gap-2 rounded-lg border border-border bg-muted/15 p-3 md:grid-cols-[1fr_190px] md:items-center">
                      <div>
                        <p className="font-medium">{PRODUCTION_STAGE_LABELS[stage.name]}</p>
                        <p className="text-xs text-muted-foreground">{stage.observations || "Sin observaciones registradas"}</p>
                      </div>
                      <LabeledSelect value={stage.status} onChange={(value) => value && patchProduction(`/production/${production._id}/stages/${stage.name}`, "Etapa actualizada", { status: value })} options={stageStatusOptions} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled={!canPause} onClick={() => patchProduction(`/production/${production._id}/pause`, "Producción pausada", { comment: "Pausa operativa" })}><Pause className="mr-2 h-4 w-4" />Pausar</Button>
                  <Button variant="outline" disabled={!canResume} onClick={() => patchProduction(`/production/${production._id}/resume`, "Producción reanudada", { comment: "Reanudación operativa" })}><Play className="mr-2 h-4 w-4" />Reanudar</Button>
                  <Button disabled={!canComplete} onClick={() => patchProduction(`/production/${production._id}/complete`, "Producción completada")}><CheckCircle2 className="mr-2 h-4 w-4" />Completar</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ModuleShell>
  )
}

export function EntregasPagosModule() {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [payment, setPayment] = useState({ orderId: "", amount: "100", method: "YAPE", paymentDate: today(), observation: "" })
  const [delivery, setDelivery] = useState({ orderId: "", deliveryDate: today(), responsibleUserId: "", receiverName: "", receiverDocument: "", confirmationNotes: "" })
  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [ordersResult, paymentsResult, usersResult] = await Promise.all([
      apiRequest<Order[]>("/orders", { query: { limit: 100 } }),
      apiRequest<Payment[]>("/payments"),
      apiRequest<User[]>("/users").catch(() => ({ data: [] as User[] })),
    ])
    setOrders(ordersResult.data)
    setPayments(paymentsResult.data)
    setUsers(usersResult.data)
  }, [])

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar pagos y entregas"))
  }, [load])

  const selectedDeliveryOrder = orders.find((order) => order._id === delivery.orderId)
  const deliveryBlocker = selectedDeliveryOrder?.status !== "PRODUCTION_COMPLETED"
    ? "Solo se puede registrar la entrega cuando la producción está completada."
    : selectedDeliveryOrder.pendingAmount > 0
      ? "El pedido aún tiene saldo pendiente."
      : null

  const createPayment = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await apiRequest("/payments", { method: "POST", body: JSON.stringify({ ...payment, amount: Number(payment.amount) }) })
      setMessage("Pago registrado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pago")
    }
  }

  const createDelivery = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await apiRequest("/deliveries", { method: "POST", body: JSON.stringify(delivery) })
      setMessage("Entrega registrada")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la entrega")
    }
  }

  return (
    <ModuleShell title="Entregas y pagos" description="Controla abonos, saldos y entrega conforme al cliente." icon={Truck}>
      <InlineAlert message={message} type="success" />
      <InlineAlert message={error} type="error" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Pagos registrados" value={String(payments.length)} helper="Operaciones capturadas" icon={WalletCards} tone="info" />
        <MetricCard title="Saldo pendiente" value={money(orders.reduce((sum, order) => sum + order.pendingAmount, 0))} helper="Total por cobrar" icon={BadgeDollarSign} tone="warning" />
        <MetricCard title="Listos para entrega" value={String(orders.filter((order) => order.status === "PRODUCTION_COMPLETED" && order.pendingAmount <= 0).length)} helper="Sin bloqueos comerciales" icon={Truck} tone="success" />
      </div>
      <Tabs defaultValue="pagos" className="space-y-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="saldos">Saldos</TabsTrigger>
          <TabsTrigger value="entregas">Entregas</TabsTrigger>
        </TabsList>
        <TabsContent value="pagos">
          <Card><CardHeader><CardTitle>Registrar pago</CardTitle></CardHeader><CardContent><form onSubmit={createPayment} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Pedido"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={payment.orderId} onChange={(event) => setPayment({ ...payment, orderId: event.target.value })}><option value="">Seleccionar pedido</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.trackingCode} · {getOrderCustomerName(order)} · saldo {money(order.pendingAmount)}</option>)}</select></Field>
            <Field label="Monto"><Input type="number" min="0.01" step="0.01" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} /></Field>
            <Field label="Método de pago"><LabeledSelect value={payment.method} onChange={(value) => setPayment({ ...payment, method: value || "YAPE" })} options={paymentMethodOptions} /></Field>
            <Field label="Fecha"><Input type="date" value={payment.paymentDate} onChange={(e) => setPayment({ ...payment, paymentDate: e.target.value })} /></Field>
            <Field label="Observación"><Input value={payment.observation} onChange={(e) => setPayment({ ...payment, observation: e.target.value })} /></Field>
            <div className="flex items-end"><Button className="w-full" disabled={!payment.orderId}><WalletCards className="mr-2 h-4 w-4" />Registrar pago</Button></div>
          </form></CardContent></Card>
        </TabsContent>
        <TabsContent value="saldos">
          <Card><CardHeader><CardTitle>Saldos por pedido</CardTitle></CardHeader><CardContent className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm"><thead className="bg-muted/40 text-left text-muted-foreground"><tr><th className="px-3 py-2">Pedido</th><th>Cliente</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Estado</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id} className="border-t"><td className="px-3 py-2 font-medium">{order.trackingCode}</td><td>{getOrderCustomerName(order)}</td><td>{money(order.totalAmount)}</td><td>{money(order.paidAmount)}</td><td>{money(order.pendingAmount)}</td><td><StatusChip status={order.status} /></td></tr>)}</tbody></table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="entregas">
          <Card><CardHeader><CardTitle>Registrar entrega</CardTitle></CardHeader><CardContent><form onSubmit={createDelivery} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Pedido"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={delivery.orderId} onChange={(event) => setDelivery({ ...delivery, orderId: event.target.value })}><option value="">Seleccionar pedido</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.trackingCode} · {ORDER_STATUS_LABELS[order.status]} · saldo {money(order.pendingAmount)}</option>)}</select></Field>
            <Field label="Responsable"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={delivery.responsibleUserId} onChange={(event) => setDelivery({ ...delivery, responsibleUserId: event.target.value })}><option value="">Seleccionar responsable</option>{users.map((user) => <option key={user._id} value={user._id}>{user.fullName}</option>)}</select></Field>
            <Field label="Fecha"><Input type="date" value={delivery.deliveryDate} onChange={(e) => setDelivery({ ...delivery, deliveryDate: e.target.value })} /></Field>
            <Field label="Persona que recibe"><Input value={delivery.receiverName} onChange={(e) => setDelivery({ ...delivery, receiverName: e.target.value })} /></Field>
            <Field label="Documento"><Input value={delivery.receiverDocument} onChange={(e) => setDelivery({ ...delivery, receiverDocument: e.target.value })} /></Field>
            <Field label="Notas"><Input value={delivery.confirmationNotes} onChange={(e) => setDelivery({ ...delivery, confirmationNotes: e.target.value })} /></Field>
            <div className="xl:col-span-3">{delivery.orderId && deliveryBlocker ? <InlineAlert message={deliveryBlocker} type="error" /> : null}</div>
            <div className="flex items-end"><Button disabled={!delivery.orderId || !delivery.responsibleUserId || Boolean(deliveryBlocker)}><Truck className="mr-2 h-4 w-4" />Registrar entrega</Button></div>
          </form></CardContent></Card>
        </TabsContent>
      </Tabs>
    </ModuleShell>
  )
}

export function InventarioModule() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [alerts, setAlerts] = useState<Material[]>([])
  const [material, setMaterial] = useState({ name: "", description: "", unit: "BOARD", currentStock: "0", minimumStock: "1", unitCost: "0" })
  const [movement, setMovement] = useState({ materialId: "", type: "IN", quantity: "1", reason: "Movimiento de inventario" })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [materialsResult, alertsResult] = await Promise.all([apiRequest<Material[]>("/materials"), apiRequest<Material[]>("/materials/alerts/low-stock")])
    setMaterials(materialsResult.data)
    setAlerts(alertsResult.data)
  }, [])

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar inventario"))
  }, [load])

  const createMaterial = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await apiRequest("/materials", { method: "POST", body: JSON.stringify({ ...material, currentStock: Number(material.currentStock), minimumStock: Number(material.minimumStock), unitCost: Number(material.unitCost) }) })
      setMessage("Material registrado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar material")
    }
  }

  const createMovement = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await apiRequest("/inventory-movements", { method: "POST", body: JSON.stringify({ ...movement, quantity: Number(movement.quantity) }) })
      setMessage("Movimiento registrado y stock actualizado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar movimiento")
    }
  }

  return (
    <ModuleShell title="Inventario" description="Controla materiales, movimientos y alertas de stock bajo." icon={Boxes}>
      <InlineAlert message={message} type="success" />
      <InlineAlert message={error} type="error" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Materiales activos" value={String(materials.length)} helper="Registrados en almacén" icon={Boxes} tone="info" />
        <MetricCard title="Alertas de stock" value={String(alerts.length)} helper="Bajo el mínimo definido" icon={AlertTriangle} tone="warning" />
        <MetricCard title="Valor de inventario" value={money(materials.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0))} helper="Stock por costo unitario" icon={BadgeDollarSign} tone="success" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Registrar material</CardTitle></CardHeader><CardContent><form onSubmit={createMaterial} className="grid gap-3 md:grid-cols-2">
          <Field label="Nombre"><Input value={material.name} onChange={(e) => setMaterial({ ...material, name: e.target.value })} required /></Field>
          <Field label="Unidad"><LabeledSelect value={material.unit} onChange={(value) => setMaterial({ ...material, unit: value || "BOARD" })} options={materialUnitOptions} /></Field>
          <Field label="Stock inicial"><Input type="number" value={material.currentStock} onChange={(e) => setMaterial({ ...material, currentStock: e.target.value })} /></Field>
          <Field label="Stock mínimo"><Input type="number" value={material.minimumStock} onChange={(e) => setMaterial({ ...material, minimumStock: e.target.value })} /></Field>
          <Field label="Costo unitario"><Input type="number" step="0.01" value={material.unitCost} onChange={(e) => setMaterial({ ...material, unitCost: e.target.value })} /></Field>
          <div className="flex items-end"><Button className="w-full"><Plus className="mr-2 h-4 w-4" />Guardar material</Button></div>
        </form></CardContent></Card>
        <Card><CardHeader><CardTitle>Movimiento de inventario</CardTitle></CardHeader><CardContent><form onSubmit={createMovement} className="grid gap-3">
          <Field label="Material"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={movement.materialId} onChange={(event) => setMovement({ ...movement, materialId: event.target.value })}><option value="">Seleccionar material</option>{materials.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field>
          <Field label="Tipo de movimiento"><LabeledSelect value={movement.type} onChange={(value) => setMovement({ ...movement, type: value || "IN" })} options={movementTypeOptions} /></Field>
          <Field label="Cantidad"><Input type="number" value={movement.quantity} onChange={(e) => setMovement({ ...movement, quantity: e.target.value })} /></Field>
          <Field label="Motivo"><Input value={movement.reason} onChange={(e) => setMovement({ ...movement, reason: e.target.value })} /></Field>
          <Button disabled={!movement.materialId}><RefreshCw className="mr-2 h-4 w-4" />Registrar movimiento</Button>
        </form></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Stock disponible</CardTitle></CardHeader><CardContent className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm"><thead className="bg-muted/40 text-left text-muted-foreground"><tr><th className="px-3 py-2">Material</th><th>Unidad</th><th>Stock</th><th>Mínimo</th><th>Costo</th><th>Estado</th></tr></thead><tbody>{materials.map((item) => <tr key={item._id} className="border-t"><td className="px-3 py-2 font-medium">{item.name}</td><td>{MATERIAL_UNIT_LABELS[item.unit]}</td><td>{item.currentStock}</td><td>{item.minimumStock}</td><td>{money(item.unitCost)}</td><td>{item.currentStock <= item.minimumStock ? <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">Stock bajo</Badge> : <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">Disponible</Badge>}</td></tr>)}</tbody></table>
      </CardContent></Card>
    </ModuleShell>
  )
}

export function ReportesModule() {
  const [range, setRange] = useState({ dateFrom: "", dateTo: "" })
  const [sales, setSales] = useState<Record<string, unknown> | null>(null)
  const [production, setProduction] = useState<Record<string, unknown> | null>(null)
  const [inventory, setInventory] = useState<Record<string, unknown> | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "Admin123456", role: "VENDEDOR" })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [salesResult, productionResult, inventoryResult, usersResult] = await Promise.all([
      apiRequest<Record<string, unknown>>("/reports/sales", { query: range }),
      apiRequest<Record<string, unknown>>("/reports/production", { query: range }),
      apiRequest<Record<string, unknown>>("/reports/inventory"),
      apiRequest<User[]>("/users"),
    ])
    setSales(salesResult.data)
    setProduction(productionResult.data)
    setInventory(inventoryResult.data)
    setUsers(usersResult.data)
  }, [range])

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar reportes"))
  }, [load])

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await apiRequest("/users", { method: "POST", body: JSON.stringify(newUser) })
      setMessage("Usuario registrado")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar usuario")
    }
  }

  const updateUserRole = async (id: string, role: Role) => {
    await apiRequest(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) })
    await load()
  }

  const updateUserStatus = async (id: string, isActive: boolean) => {
    await apiRequest(`/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) })
    await load()
  }

  return (
    <ModuleShell title="Reportes y usuarios" description="Indicadores de ventas, producción, inventario y administración de cuentas." icon={FileBarChart2}>
      <InlineAlert message={message} type="success" />
      <InlineAlert message={error} type="error" />
      <Card><CardHeader><CardTitle>Periodo de análisis</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Field label="Desde"><Input type="date" value={range.dateFrom} onChange={(e) => setRange({ ...range, dateFrom: e.target.value })} /></Field>
        <Field label="Hasta"><Input type="date" value={range.dateTo} onChange={(e) => setRange({ ...range, dateTo: e.target.value })} /></Field>
        <div className="flex items-end"><Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Actualizar</Button></div>
      </CardContent></Card>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Ventas" value={money(Number(sales?.totalSalesAmount ?? 0))} helper="Monto vendido" icon={BadgeDollarSign} tone="success" />
        <MetricCard title="Pagado" value={money(Number(sales?.totalPaidAmount ?? 0))} helper="Cobros registrados" icon={WalletCards} tone="info" />
        <MetricCard title="Producciones" value={String(production?.totalProductions ?? 0)} helper="Órdenes de fabricación" icon={Factory} tone="neutral" />
        <MetricCard title="Materiales" value={String(inventory?.totalMaterials ?? 0)} helper="Insumos activos" icon={Boxes} tone="warning" />
      </div>
      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="produccion">Producción</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios" className="space-y-4">
          <Card><CardHeader><CardTitle>Registrar usuario</CardTitle></CardHeader><CardContent><form onSubmit={createUser} className="grid gap-3 md:grid-cols-5">
            <Input placeholder="Nombre completo" value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
            <Input placeholder="Correo electrónico" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <Input placeholder="Contraseña" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <LabeledSelect value={newUser.role} onChange={(value) => setNewUser({ ...newUser, role: value || "VENDEDOR" })} options={roleOptions} />
            <Button><UserPlus className="mr-2 h-4 w-4" />Crear usuario</Button>
          </form></CardContent></Card>
          <Card><CardHeader><CardTitle>Usuarios registrados</CardTitle></CardHeader><CardContent className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm"><thead className="bg-muted/40 text-left text-muted-foreground"><tr><th className="px-3 py-2">Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{users.map((user) => <tr key={user._id} className="border-t"><td className="px-3 py-2 font-medium">{user.fullName}</td><td>{user.email}</td><td><LabeledSelect value={user.role} onChange={(value) => value && updateUserRole(user._id, value)} options={roleOptions} /></td><td>{user.isActive ? "Activo" : "Inactivo"}</td><td><Button variant="outline" size="sm" onClick={() => updateUserStatus(user._id, !user.isActive)}>{user.isActive ? "Desactivar" : "Activar"}</Button></td></tr>)}</tbody></table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="inventario">
          <Card>
            <CardHeader><CardTitle>Resumen de inventario</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <MetricCard title="Materiales" value={String(inventory?.totalMaterials ?? 0)} helper="Insumos activos" icon={Boxes} tone="info" />
              <MetricCard title="Valor total" value={money(Number(inventory?.totalInventoryValue ?? 0))} helper="Stock valorizado" icon={BadgeDollarSign} tone="success" />
              <MetricCard title="Stock bajo" value={String(Array.isArray(inventory?.lowStockMaterials) ? inventory.lowStockMaterials.length : 0)} helper="Materiales por reponer" icon={AlertTriangle} tone="warning" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="produccion">
          <Card>
            <CardHeader><CardTitle>Resumen de producción</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <MetricCard title="Total" value={String(production?.totalProductions ?? 0)} helper="Órdenes registradas" icon={Factory} tone="info" />
              <MetricCard title="En proceso" value={String(production?.inProgressProductions ?? 0)} helper="Fabricación activa" icon={Play} tone="neutral" />
              <MetricCard title="Pausadas" value={String(production?.pausedProductions ?? 0)} helper="Con interrupción" icon={Pause} tone="warning" />
              <MetricCard title="Completadas" value={String(production?.completedProductions ?? 0)} helper="Listas para entrega" icon={PackageCheck} tone="success" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ModuleShell>
  )
}
