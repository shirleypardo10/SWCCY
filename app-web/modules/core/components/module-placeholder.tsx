"use client"

import Link from "next/link"
import { useMemo } from "react"

import { ROLE_LABELS } from "@/constants/roles"
import { useAuth } from "@/hooks/use-auth"
import {
  BUSINESS_MODULES,
  MODULE_SUMMARY_BY_ROLE,
  MODULES_ENABLED_BY_ROLE,
} from "@/mocks/modules"
import { APP_ROUTES } from "@/routes/app-routes"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
} from "@/shared/components/ui"
import type { ModuleKey } from "@/types/modules"

interface ModulePlaceholderProps {
  moduleKey: ModuleKey
}

export function ModulePlaceholder({ moduleKey }: ModulePlaceholderProps) {
  const { user } = useAuth()

  const moduleInfo = BUSINESS_MODULES[moduleKey]

  const phaseLabel = moduleInfo.phase === "base_disponible" ? "Base disponible" : "En construcción"

  const roleEnabledModules = useMemo(() => {
    if (!user) {
      return [] as ModuleKey[]
    }

    return MODULES_ENABLED_BY_ROLE[user.role]
  }, [user])

  const hasModuleEnabled = roleEnabledModules.includes(moduleKey)

  const roleSummary = user
    ? `${ROLE_LABELS[user.role]}: ${MODULE_SUMMARY_BY_ROLE[user.role]}`
    : "No se encontró sesión activa."

  return (
    <section className="space-y-5">
      <PageHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
        rightSlot={
          <Badge
            variant={moduleInfo.phase === "base_disponible" ? "secondary" : "outline"}
            className="text-xs"
          >
            {phaseLabel}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Estado del módulo en Fase 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{roleSummary}</p>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Capacidades planificadas
              </p>
              <ul className="space-y-2">
                {moduleInfo.plannedCapabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-foreground"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle funcional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Área responsable:</span>{" "}
              {moduleInfo.ownerArea}
            </p>
            <p>
              <span className="font-semibold text-foreground">Ruta técnica:</span> {moduleInfo.route}
            </p>
            <p>
              <span className="font-semibold text-foreground">Acceso actual:</span>{" "}
              {hasModuleEnabled ? "Habilitado para tu rol" : "Restringido para tu rol"}
            </p>

            <Button asChild variant="outline" className="w-full">
              <Link href={APP_ROUTES.dashboard}>Volver al dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <EmptyState
        title="Zona preparada para implementación funcional"
        description="Este espacio queda listo para integrar formularios, tablas, filtros y conexión con backend real sin rediseñar la arquitectura base."
      />
    </section>
  )
}
