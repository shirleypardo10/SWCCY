export const MODULE_KEYS = [
  "pedidos",
  "produccion",
  "entregasPagos",
  "inventario",
  "reportes",
] as const

export type ModuleKey = (typeof MODULE_KEYS)[number]

export const MODULE_PHASE_VALUES = ["base_disponible", "en_construccion"] as const
export type ModulePhase = (typeof MODULE_PHASE_VALUES)[number]

export interface BusinessModule {
  key: ModuleKey
  title: string
  route: string
  description: string
  phase: ModulePhase
  ownerArea: string
  plannedCapabilities: string[]
}
