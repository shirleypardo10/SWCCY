import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-muted/35 p-6 text-center">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
