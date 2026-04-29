import type { Role } from "@/types/auth"

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_ORDERS: "manage_orders",
  VIEW_OWN_REQUESTS: "view_own_requests",
  UPDATE_PRODUCTION: "update_production",
  MANAGE_DELIVERIES_PAYMENTS: "manage_deliveries_payments",
  VIEW_INVENTORY: "view_inventory",
  VIEW_REPORTS: "view_reports",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  cliente: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_OWN_REQUESTS],
  vendedor: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MANAGE_DELIVERIES_PAYMENTS,
  ],
  gerente: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.UPDATE_PRODUCTION,
    PERMISSIONS.MANAGE_DELIVERIES_PAYMENTS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_REPORTS,
  ],
  produccion: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.UPDATE_PRODUCTION,
  ],
}
