import { Suspense } from "react"

import { LoginForm } from "@/modules/auth/components/login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando acceso...</div>}>
      <LoginForm />
    </Suspense>
  )
}
