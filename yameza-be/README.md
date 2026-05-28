# SWCCY Backend

Backend REST para el Sistema Web para el Control Comercial de YAMEZA S.A.C., empresa peruana de muebles personalizados. Centraliza clientes, pedidos, cotizaciones, produccion, pagos, entregas, materiales, inventario, usuarios y reportes.

## Stack

Node.js 20+, NestJS 10, TypeScript estricto, MongoDB, Mongoose, JWT, bcrypt, class-validator, Swagger/OpenAPI, Jest, ESLint, Prettier y Docker Compose.

## Arquitectura

El proyecto usa arquitectura modular de NestJS. `src/common` contiene guards, decoradores, filtros, interceptores, DTOs y utilidades compartidas. `src/config` centraliza variables de entorno. `src/database` conecta MongoDB. `src/modules` agrupa los bounded contexts: auth, users, roles, customers, orders, quotations, production, payments, deliveries, materials, inventory-movements y reports.

Todas las respuestas exitosas siguen:

```json
{ "success": true, "message": "string", "data": {} }
```

Las listas paginadas agregan:

```json
{ "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 } }
```

## Requisitos

- Node.js 20 o superior
- npm
- Docker Desktop
- MongoDB local o Docker

## Instalacion

```bash
npm install
cp .env.example .env
docker compose up -d
npm run seed
npm run start:dev
```

Swagger queda disponible en `http://localhost:3000/docs`.

## Variables de entorno

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/swccy
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
DEFAULT_TAX_RATE=0.18
ALLOW_DELIVERY_WITH_PENDING_BALANCE=false
```

## Scripts

- `npm run start`: ejecuta NestJS.
- `npm run start:dev`: ejecuta en modo watch.
- `npm run build`: compila TypeScript.
- `npm run test`: ejecuta Jest.
- `npm run lint`: ejecuta ESLint.
- `npm run format`: aplica Prettier.
- `npm run seed`: crea roles y admin inicial.

## Credenciales iniciales

```json
{ "email": "admin@yameza.com", "password": "Admin123456" }
```

## Autenticacion

Usa `POST /auth/login` y envia el token en `Authorization: Bearer <accessToken>`.

```json
{
  "email": "admin@yameza.com",
  "password": "Admin123456"
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": { "accessToken": "jwt", "user": { "email": "admin@yameza.com", "role": "ADMIN" } }
}
```

## Endpoints

Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/profile`, `POST /auth/refresh`, `POST /auth/logout`.

Users: `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `PATCH /users/:id/status`, `PATCH /users/:id/role`, `DELETE /users/:id`.

Roles: `POST /roles`, `GET /roles`, `GET /roles/:id`, `PATCH /roles/:id`.

Customers: `POST /customers`, `GET /customers`, `GET /customers/:id`, `PATCH /customers/:id`.

Orders: `POST /orders`, `GET /orders`, `GET /orders/:id`, `GET /orders/tracking/:trackingCode`, `PATCH /orders/:id`, `PATCH /orders/:id/status`, `GET /orders/:id/balance`, `DELETE /orders/:id`.

Quotations: `POST /quotations/order/:orderId/generate`, `GET /quotations`, `GET /quotations/:id`, `PATCH /quotations/:id/status`, `GET /quotations/:id/pdf`.

Production: `POST /production/order/:orderId/start`, `GET /production`, `GET /production/:id`, `GET /production/order/:orderId`, `PATCH /production/:id/pause`, `PATCH /production/:id/resume`, `PATCH /production/:id/complete`, `PATCH /production/:productionId/stages/:stageName`, `GET /production/:id/progress`, `PATCH /production/:id/progress`.

Payments: `POST /payments`, `GET /payments`, `GET /payments/:id`, `GET /payments/order/:orderId`.

Deliveries: `POST /deliveries`, `GET /deliveries`, `GET /deliveries/:id`, `GET /deliveries/order/:orderId`.

Materials: `POST /materials`, `GET /materials`, `GET /materials/:id`, `PATCH /materials/:id`, `DELETE /materials/:id`, `GET /materials/:id/stock`, `GET /materials/alerts/low-stock`.

Inventory Movements: `POST /inventory-movements`, `GET /inventory-movements`, `GET /inventory-movements/:id`, `GET /inventory-movements/material/:materialId`.

Reports: `GET /reports/sales?dateFrom=&dateTo=`, `GET /reports/production?dateFrom=&dateTo=`, `GET /reports/inventory`.

## Ejemplos por caso de uso

Crear cliente:

```json
{ "documentType": "DNI", "documentNumber": "74253618", "fullName": "Juan Perez", "phone": "987654321", "email": "juan@mail.com", "address": "Lima" }
```

Crear material:

```json
{ "name": "Melamina blanca 18mm", "unit": "BOARD", "currentStock": 20, "minimumStock": 5, "unitCost": 85.5 }
```

Registrar pedido con cliente existente:

```json
{
  "customerId": "665000000000000000000001",
  "furnitureType": "ROPERO",
  "quantity": 1,
  "measurements": { "width": 120, "height": 180, "depth": 55, "unit": "CM" },
  "materialIds": ["665000000000000000000002"],
  "observations": "Color blanco con dos puertas"
}
```

Registrar pedido creando cliente:

```json
{
  "customer": { "documentType": "DNI", "documentNumber": "70000000", "fullName": "Maria Lopez", "phone": "999999999" },
  "furnitureType": "COMODA",
  "quantity": 1,
  "measurements": { "width": 90, "height": 100, "depth": 45, "unit": "CM" }
}
```

Generar cotizacion:

```json
{ "laborCost": 250, "additionalCost": 30, "taxRate": 0.18 }
```

Aprobar cotizacion:

```json
{ "status": "ACCEPTED" }
```

Actualizar estado del pedido:

```json
{ "status": "APPROVED" }
```

Iniciar produccion:

```json
{ "comment": "Inicio autorizado por gerencia" }
```

Actualizar etapa:

```json
{ "status": "COMPLETED", "responsibleUserId": "665000000000000000000003", "observations": "Etapa completada sin incidencias" }
```

Registrar pago:

```json
{ "orderId": "665000000000000000000004", "amount": 200, "method": "YAPE", "paymentDate": "2026-05-07", "observation": "Adelanto" }
```

Registrar entrega:

```json
{ "orderId": "665000000000000000000004", "deliveryDate": "2026-05-07", "responsibleUserId": "665000000000000000000003", "receiverName": "Juan Perez", "receiverDocument": "74253618", "confirmationNotes": "Recibido conforme" }
```

Movimiento de inventario:

```json
{ "materialId": "665000000000000000000002", "type": "OUT", "quantity": 2, "reason": "Uso en pedido", "referenceType": "ORDER", "referenceId": "665000000000000000000004" }
```

Respuesta de saldo:

```json
{ "orderId": "id", "totalAmount": 500, "paidAmount": 200, "pendingAmount": 300, "isFullyPaid": false }
```

## Flujo recomendado

1. Login con admin.
2. Crear cliente.
3. Registrar material.
4. Registrar pedido.
5. Generar cotizacion.
6. Aceptar cotizacion o aprobar pedido.
7. Iniciar produccion.
8. Completar etapas: `CORTE`, `CANTEADO`, `ABISAGRADO`, `ENSAMBLADO`, `ACABADO`.
9. Completar produccion.
10. Registrar pago.
11. Registrar entrega.
12. Consultar reportes.

## Roles

- `ADMIN`: acceso total.
- `GERENTE`: reportes, consulta general, ventas, produccion e inventario.
- `VENDEDOR`: pedidos, cotizaciones, clientes, pagos y entregas.
- `PRODUCTOR`: produccion y avance de pedidos.
- `ALMACENERO`: materiales, inventario y movimientos.

## Errores comunes

- `400`: validacion de DTO o MongoId invalido.
- `401`: token ausente, vencido o credenciales invalidas.
- `403`: rol no autorizado.
- `404`: recurso inexistente.
- `409`: duplicados o regla de negocio incumplida.
- `500`: error no controlado.

## Notas frontend

Todos los endpoints, excepto login/register, requieren Bearer token. Los enums deben enviarse exactamente como aparecen en Swagger. Para formularios con montos, cantidades y medidas, enviar numeros, no strings. Para filtros de pedidos usar `page`, `limit`, `status`, `furnitureType`, `trackingCode`, `dateFrom`, `dateTo`, `customerName` y `documentNumber`. Las fechas deben enviarse en formato ISO o `YYYY-MM-DD`.
