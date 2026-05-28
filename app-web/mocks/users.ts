import type { User } from "@/types/auth"

export const MOCK_USERS: User[] = [
  {
    id: "usr-adm-001",
    fullName: "Administrador Yameza",
    email: "cliente@yameza.com",
    role: "ADMIN",
    status: "activo",
  },
  {
    id: "usr-ven-001",
    fullName: "Luis Mendoza Paredes",
    email: "vendedor@yameza.com",
    role: "VENDEDOR",
    status: "activo",
  },
  {
    id: "usr-ger-001",
    fullName: "Mariana Rojas Cabrera",
    email: "gerente@yameza.com",
    role: "GERENTE",
    status: "activo",
  },
  {
    id: "usr-prd-001",
    fullName: "Jorge Huamán Torres",
    email: "produccion@yameza.com",
    role: "PRODUCTOR",
    status: "activo",
  },
  {
    id: "usr-alm-001",
    fullName: "Diana Campos Pizarro",
    email: "almacen@yameza.com",
    role: "ALMACENERO",
    status: "activo",
  },
]

export const MOCK_LOGIN_HINTS = MOCK_USERS.filter((user) => user.status === "activo").map(
  ({ fullName, role, email }) => ({
    firstName: fullName,
    role,
    email,
    password: "Credenciales del backend",
  })
)
