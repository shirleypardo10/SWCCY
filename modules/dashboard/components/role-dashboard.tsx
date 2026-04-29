"use client"

import { useMemo, useState } from "react"

import { useAuth } from "@/hooks/use-auth"
import { DASHBOARD_DATA_BY_ROLE } from "@/mocks/dashboard"
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusChip,
} from "@/shared/components/ui"

const CARD_TONE_STYLES = {
  neutral: "from-slate-50 to-slate-100 border-slate-200",
  success: "from-emerald-50 to-emerald-100 border-emerald-200",
  warning: "from-amber-50 to-amber-100 border-amber-200",
  danger: "from-rose-50 to-rose-100 border-rose-200",
  info: "from-sky-50 to-sky-100 border-sky-200",
} as const

export function RoleDashboard() {
  const { user } = useAuth()
  const [period, setPeriod] = useState("semana")

  const dashboardData = useMemo(() => {
    if (!user) {
      return null
    }

    return DASHBOARD_DATA_BY_ROLE[user.role]
  }, [user])

  if (!dashboardData || !user) {
    return null
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title={`Dashboard ${dashboardData.heading}`}
        description={dashboardData.description}
        rightSlot={
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Periodo
            </span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]" aria-label="Seleccionar periodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="semana">Semana</SelectItem>
                <SelectItem value="mes">Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {dashboardData.cards.map((card) => (
          <Card
            key={card.id}
            className={`border bg-gradient-to-br ${CARD_TONE_STYLES[card.tone]} shadow-sm`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-600">{card.helperText}</p>
              <Badge
                variant="outline"
                className="mt-3 border-slate-300 bg-white text-slate-700"
              >
                {card.trendLabel}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad reciente</CardTitle>
          <p className="text-sm text-muted-foreground">
            Últimas actualizaciones operativas del flujo comercial.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {dashboardData.activity.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  <p className="text-xs text-muted-foreground">{item.dateLabel}</p>
                </div>
                <StatusChip status={item.status} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
