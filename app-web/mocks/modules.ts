import type { Role } from "@/types/auth"
import type { BusinessModule, ModuleKey } from "@/types/modules"

export const BUSINESS_MODULES: Record<ModuleKey, BusinessModule> = {
  pedidos: {
    key: "pedidos",
    title: "Gestión de Pedidos",
    route: "/pedidos",
    description:
      "Centraliza solicitudes, cotizaciones y pedidos confirmados para evitar pérdida de información comercial.",
    phase: "base_disponible",
    ownerArea: "Comercial",
    plannedCapabilities: [
      "Formulario completo de registro de pedidos",
      "Flujo de cotización con versiones",
      "Historial de interacciones por cliente",
      "Estados de avance con trazabilidad",
    ],
  },
  produccion: {
    key: "produccion",
    title: "Producción",
    route: "/produccion",
    description:
      "Permite planificar y actualizar el estado de fabricación por pedido y prioridad operativa.",
    phase: "base_disponible",
    ownerArea: "Planta",
    plannedCapabilities: [
      "Cola de órdenes por prioridad",
      "Asignación de responsables por etapa",
      "Checkpoints de calidad",
      "Indicadores de tiempo de ciclo",
    ],
  },
  entregasPagos: {
    key: "entregasPagos",
    title: "Entregas y Pagos",
    route: "/entregas-pagos",
    description:
      "Orquesta la coordinación logística y el control comercial de pagos sin facturación en esta etapa.",
    phase: "en_construccion",
    ownerArea: "Comercial / Logística",
    plannedCapabilities: [
      "Agenda de entregas por zona",
      "Confirmaciones de recepción",
      "Registro de abonos y saldos",
      "Alertas de pagos pendientes",
    ],
  },
  inventario: {
    key: "inventario",
    title: "Inventario",
    route: "/inventario",
    description:
      "Visibilidad de stock crítico de tableros, herrajes y accesorios para evitar cuellos de botella.",
    phase: "en_construccion",
    ownerArea: "Operaciones",
    plannedCapabilities: [
      "Stock por almacén",
      "Niveles mínimos y alertas",
      "Consumo por orden de producción",
      "Trazabilidad de entradas y salidas",
    ],
  },
  reportes: {
    key: "reportes",
    title: "Reportes",
    route: "/reportes",
    description:
      "Consolida KPIs comerciales y operativos para la toma de decisiones de gerencia.",
    phase: "en_construccion",
    ownerArea: "Gerencia",
    plannedCapabilities: [
      "Dashboard de ventas por periodo",
      "Cumplimiento de producción y entrega",
      "Rentabilidad por línea de producto",
      "Exportación de reportes estratégicos",
    ],
  },
}

export const MODULES_ENABLED_BY_ROLE: Record<Role, ModuleKey[]> = {
  ADMIN: ["pedidos", "produccion", "entregasPagos", "inventario", "reportes"],
  GERENTE: ["pedidos", "produccion", "entregasPagos", "inventario", "reportes"],
  VENDEDOR: ["pedidos", "entregasPagos"],
  PRODUCTOR: ["pedidos", "produccion"],
  ALMACENERO: ["inventario"],
}

export const MODULE_SUMMARY_BY_ROLE: Record<Role, string> = {
  ADMIN:
    "Tienes acceso operativo completo a la gestión comercial, producción, almacén y administración.",
  GERENTE:
    "Tienes acceso completo para monitoreo estratégico y coordinación entre áreas.",
  VENDEDOR:
    "Tu foco está en captación, cotización y seguimiento comercial de pedidos activos.",
  PRODUCTOR:
    "Tu enfoque está en actualizar fabricación y mantener flujo operativo estable.",
  ALMACENERO:
    "Tu enfoque está en mantener el inventario actualizado y controlar alertas de stock.",
}
