import type { ReactNode } from "react"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1fr_480px]">
      <section className="relative hidden overflow-hidden border-r border-border bg-[radial-gradient(circle_at_top,#f6ece1_0%,#f3f5f4_42%,#f0f2ef_100%)] px-10 py-12 lg:block">
        <div className="relative z-10 max-w-md">
          <p className="text-xs uppercase tracking-[0.22em] text-primary/80">YAMEZA S.A.C.</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-foreground">
            Control comercial centralizado para muebles personalizados
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Ordena pedidos, producción y seguimiento comercial en una sola plataforma web.
          </p>
        </div>
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-accent/35 blur-3xl" />
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">{children}</section>
    </div>
  )
}
