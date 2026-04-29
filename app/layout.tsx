import type { Metadata } from "next"
import { Manrope, Sora } from "next/font/google"

import { APP_DESCRIPTION, APP_NAME } from "@/config/app"
import { AuthProvider } from "@/modules/auth/context/auth-context"
import "./globals.css"

const fontSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const fontHeading = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontHeading.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
