import type { ReactNode } from "react"

import { AuthLayout } from "@/shared/layouts/auth-layout"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
