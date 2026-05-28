# Shir Monorepo

Repositorio con el backend en `yameza-be` y el frontend en `app-web`.

## Requisitos

- Node.js instalado
- npm instalado
- Docker Desktop o Docker Engine con Compose

## Comandos desde la raíz

### Desarrollo

```bash
npm run dev
```

Arranca backend y frontend en paralelo usando puertos libres automáticamente.
El frontend queda conectado al backend mediante `NEXT_PUBLIC_API_URL`.

### Compilación

```bash
npm run build
```

Compila backend y frontend en secuencia.

### Bootstrap inicial del backend

```bash
npm run backend:bootstrap
```

Este comando hace exactamente esto, en este orden:

```bash
docker compose -f yameza-be/docker-compose.yml up -d
npm --prefix yameza-be run seed
npm --prefix yameza-be run start
```

Úsalo la primera vez que prepares el backend, o cuando quieras volver a levantar la base y cargar datos iniciales.

## Comandos por separado

### Backend en desarrollo

```bash
npm run dev:backend
```

Usa el `PORT` definido en `yameza-be/.env` o el valor por defecto del backend.

### Frontend en desarrollo

```bash
npm run dev:frontend
```

Usa su configuración normal de Next.js en `app-web`.

### Backend build

```bash
npm run build:backend
```

### Frontend build

```bash
npm run build:frontend
```

## Comandos originales del backend

Si prefieres entrar a la carpeta `yameza-be`, también puedes ejecutar manualmente:

```bash
cd yameza-be
docker compose up -d
npm run seed
npm run start
```

## Nota importante

- `npm run dev` no reemplaza el bootstrap inicial del backend.
- Para que el backend quede listo por primera vez, usa `npm run backend:bootstrap`.
- Después de eso, para trabajar normalmente, usa `npm run dev`.
- `npm run dev` levanta el frontend con un `distDir` separado para no chocar con otras sesiones previas.
