import type { User } from "@/types/auth"

export const MOCK_USERS: User[] = [
  {
    id: "usr-cli-001",
    firstName: "Carla",
    lastName: "Quispe Salas",
    email: "cliente@yameza.com",
    role: "cliente",
    status: "activo",
    password: "Cliente2026!",
  },
  {
    id: "usr-ven-001",
    firstName: "Luis",
    lastName: "Mendoza Paredes",
    email: "vendedor@yameza.com",
    role: "vendedor",
    status: "activo",
    password: "Vendedor2026!",
  },
  {
    id: "usr-ger-001",
    firstName: "Mariana",
    lastName: "Rojas Cabrera",
    email: "gerente@yameza.com",
    role: "gerente",
    status: "activo",
    password: "Gerente2026!",
  },
  {
    id: "usr-prd-001",
    firstName: "Jorge",
    lastName: "Huamán Torres",
    email: "produccion@yameza.com",
    role: "produccion",
    status: "activo",
    password: "Produccion2026!",
  },
  {
    id: "usr-ven-002",
    firstName: "Diana",
    lastName: "Campos Pizarro",
    email: "vendedor.inactivo@yameza.com",
    role: "vendedor",
    status: "inactivo",
    password: "Vendedor2026!",
  },
]

export const MOCK_LOGIN_HINTS = MOCK_USERS.filter((user) => user.status === "activo").map(
  ({ firstName, role, email, password }) => ({
    firstName,
    role,
    email,
    password,
  })
)
