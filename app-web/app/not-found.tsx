import Link from "next/link"

import { Button } from "@/shared/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Error 404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La ruta solicitada no existe en esta fase del sistema comercial.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/dashboard">Ir al dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Ir al login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
