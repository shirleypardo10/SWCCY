import type { OrderStatus } from "@/types/order"

export interface MockOrder {
  id: string
  customerName: string
  productName: string
  status: OrderStatus
  amount: number
  createdAt: string
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "YAM-2026-058",
    customerName: "Inmobiliaria Trébol",
    productName: "Ropero 4 puertas",
    status: "APPROVED",
    amount: 4820,
    createdAt: "2026-04-01",
  },
  {
    id: "YAM-2026-049",
    customerName: "Hotel Marina",
    productName: "Cómoda nogal premium",
    status: "PRODUCTION_COMPLETED",
    amount: 3290,
    createdAt: "2026-03-28",
  },
  {
    id: "YAM-2026-041",
    customerName: "Andrea Alarcón",
    productName: "Closet empotrado melamine",
    status: "QUOTED",
    amount: 2450,
    createdAt: "2026-04-06",
  },
]
