import { useAuthContext } from "@/modules/auth/context/auth-context"

export function useAuth() {
  return useAuthContext()
}
