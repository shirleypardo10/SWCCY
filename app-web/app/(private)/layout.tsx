import type { ReactNode } from "react"

import { PrivateLayoutShell } from "@/shared/layouts/private-layout-shell"

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <PrivateLayoutShell>{children}</PrivateLayoutShell>
}
