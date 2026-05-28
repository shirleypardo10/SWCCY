import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description: string
  rightSlot?: ReactNode
}

export function PageHeader({ title, description, rightSlot }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {rightSlot ? <div className="sm:self-start">{rightSlot}</div> : null}
    </header>
  )
}
