import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_COOKIE_KEY } from "@/config/auth"
import { APP_ROUTES } from "@/routes/app-routes"
import { parseSessionToken } from "@/utils/session"

export default async function HomePage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(AUTH_COOKIE_KEY)?.value
  const session = parseSessionToken(sessionCookie)

  if (session) {
    redirect(APP_ROUTES.dashboard)
  }

  redirect(APP_ROUTES.login)
}
