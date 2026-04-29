"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ROLE_LABELS } from "@/constants/roles"
import { useAuth } from "@/hooks/use-auth"
import { MOCK_LOGIN_HINTS } from "@/mocks/users"
import { APP_ROUTES } from "@/routes/app-routes"
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/components/ui"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu correo")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoading, isAuthenticated, error, clearError } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setSubmitting] = useState(false)

  const redirectPath = useMemo(
    () => searchParams.get("redirect") || APP_ROUTES.dashboard,
    [searchParams]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearError()
    setSubmitting(true)

    const result = await login(values)

    if (result.success) {
      router.replace(redirectPath)
      return
    }

    setSubmitting(false)
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath)
    }
  }, [isAuthenticated, redirectPath, router])

  const formDisabled = isLoading || isSubmitting

  return (
    <div className="w-full max-w-md space-y-4">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Iniciar sesión</CardTitle>
          <p className="text-sm text-muted-foreground">
            Accede al panel comercial de YAMEZA S.A.C.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo corporativo
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@yameza.com"
                aria-invalid={Boolean(errors.email)}
                disabled={formDisabled}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                disabled={formDisabled}
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {error ? (
              <div
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={formDisabled}>
              {formDisabled ? "Validando acceso..." : "Ingresar al sistema"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-muted/35">
        <CardHeader>
          <CardTitle className="text-base">Usuarios mock disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {MOCK_LOGIN_HINTS.map((item) => (
              <li
                key={item.email}
                className="rounded-md border border-border bg-card px-3 py-2"
              >
                <p className="font-medium text-foreground">
                  {item.firstName} - {ROLE_LABELS[item.role]}
                </p>
                <p>{item.email}</p>
                <p>Clave: {item.password}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
