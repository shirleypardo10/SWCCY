import type { Role } from "@/types/auth"
import type { OrderStatus } from "@/types/order"

export const DASHBOARD_CARD_TONES = [
  "neutral",
  "success",
  "warning",
  "danger",
  "info",
] as const

export type DashboardCardTone = (typeof DASHBOARD_CARD_TONES)[number]

export interface DashboardCard {
  id: string
  title: string
  value: string
  helperText: string
  trendLabel: string
  tone: DashboardCardTone
}

export interface DashboardActivityItem {
  id: string
  title: string
  subtitle: string
  status: OrderStatus
  dateLabel: string
}

export interface RoleDashboardData {
  role: Role
  heading: string
  description: string
  cards: DashboardCard[]
  activity: DashboardActivityItem[]
}
