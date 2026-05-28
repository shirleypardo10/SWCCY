import Link from "next/link"

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui"

export default function ForbiddenPage() {
  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-destructive">Error 403</p>
        <CardTitle className="font-heading text-2xl">Acceso denegado</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Tu perfil no tiene permisos para ingresar a esta ruta.
        </p>
        <div className="mt-5 flex gap-2">
          <Button asChild>
            <Link href="/dashboard">Volver al dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Cambiar usuario</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
