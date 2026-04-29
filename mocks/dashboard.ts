import type { RoleDashboardData } from "@/types/dashboard"

export const DASHBOARD_DATA_BY_ROLE: Record<RoleDashboardData["role"], RoleDashboardData> = {
  cliente: {
    role: "cliente",
    heading: "Seguimiento de tus solicitudes",
    description:
      "Monitorea el estado de tus pedidos y cotizaciones en un solo panel.",
    cards: [
      {
        id: "cli-1",
        title: "Solicitudes activas",
        value: "3",
        helperText: "2 en cotización, 1 en producción",
        trendLabel: "+1 esta semana",
        tone: "info",
      },
      {
        id: "cli-2",
        title: "Última cotización",
        value: "S/ 2,450",
        helperText: "Ropero modelo Atenas",
        trendLabel: "En revisión",
        tone: "neutral",
      },
      {
        id: "cli-3",
        title: "Pedidos entregados",
        value: "7",
        helperText: "Histórico últimos 12 meses",
        trendLabel: "100% completados",
        tone: "success",
      },
    ],
    activity: [
      {
        id: "cli-a1",
        title: "Solicitud #YAM-2026-041",
        subtitle: "Closet melamine 3 cuerpos",
        status: "cotizacion",
        dateLabel: "Actualizado hoy 09:12",
      },
      {
        id: "cli-a2",
        title: "Pedido #YAM-2026-027",
        subtitle: "Zapatera blanca 5 niveles",
        status: "en_produccion",
        dateLabel: "Actualizado ayer 16:40",
      },
      {
        id: "cli-a3",
        title: "Pedido #YAM-2026-013",
        subtitle: "Cómoda con cajones soft-close",
        status: "entregado",
        dateLabel: "Entregado hace 3 días",
      },
    ],
  },
  vendedor: {
    role: "vendedor",
    heading: "Operación comercial diaria",
    description:
      "Controla clientes, cotizaciones pendientes y nuevos pedidos del canal comercial.",
    cards: [
      {
        id: "ven-1",
        title: "Pedidos por registrar",
        value: "11",
        helperText: "4 con prioridad alta",
        trendLabel: "+3 vs ayer",
        tone: "warning",
      },
      {
        id: "ven-2",
        title: "Cotizaciones pendientes",
        value: "8",
        helperText: "Tiempo promedio de respuesta 1.5 días",
        trendLabel: "Objetivo: <24h",
        tone: "danger",
      },
      {
        id: "ven-3",
        title: "Clientes activos",
        value: "62",
        helperText: "Portafolio comercial del mes",
        trendLabel: "+9 nuevos",
        tone: "success",
      },
    ],
    activity: [
      {
        id: "ven-a1",
        title: "Pedido #YAM-2026-058",
        subtitle: "Cliente: Inmobiliaria Trébol",
        status: "confirmado",
        dateLabel: "Ingresado hoy 08:20",
      },
      {
        id: "ven-a2",
        title: "Cotización #COT-2026-117",
        subtitle: "Cliente: Andrea Alarcón",
        status: "cotizacion",
        dateLabel: "Pendiente desde ayer",
      },
      {
        id: "ven-a3",
        title: "Pedido #YAM-2026-049",
        subtitle: "Cliente: Hotel Marina",
        status: "listo_entrega",
        dateLabel: "Listo para coordinar entrega",
      },
    ],
  },
  gerente: {
    role: "gerente",
    heading: "Visión ejecutiva comercial",
    description:
      "Analiza indicadores de ventas, productividad y cumplimiento de entregas.",
    cards: [
      {
        id: "ger-1",
        title: "Ventas del mes",
        value: "S/ 184,700",
        helperText: "Meta mensual: S/ 220,000",
        trendLabel: "+12.4% vs mes anterior",
        tone: "success",
      },
      {
        id: "ger-2",
        title: "Pedidos en curso",
        value: "37",
        helperText: "Desde cotización hasta entrega",
        trendLabel: "9 en riesgo de retraso",
        tone: "warning",
      },
      {
        id: "ger-3",
        title: "Cumplimiento de entrega",
        value: "91%",
        helperText: "Últimos 30 días",
        trendLabel: "+3 puntos",
        tone: "info",
      },
    ],
    activity: [
      {
        id: "ger-a1",
        title: "Producción semanal",
        subtitle: "22 pedidos finalizados",
        status: "entregado",
        dateLabel: "Cierre semanal",
      },
      {
        id: "ger-a2",
        title: "Alerta de materiales",
        subtitle: "Tablero MDF 18mm en nivel crítico",
        status: "solicitud",
        dateLabel: "Detectado hoy 07:50",
      },
      {
        id: "ger-a3",
        title: "Entrega reprogramada",
        subtitle: "Pedido #YAM-2026-033",
        status: "listo_entrega",
        dateLabel: "Revisar coordinación logística",
      },
    ],
  },
  produccion: {
    role: "produccion",
    heading: "Seguimiento de fabricación",
    description:
      "Prioriza órdenes en proceso y actualiza estados de producción en tiempo real.",
    cards: [
      {
        id: "pro-1",
        title: "Órdenes en producción",
        value: "19",
        helperText: "6 por iniciar, 13 en progreso",
        trendLabel: "Capacidad al 87%",
        tone: "info",
      },
      {
        id: "pro-2",
        title: "Pendientes por validar",
        value: "5",
        helperText: "Esperan revisión de calidad",
        trendLabel: "2 urgentes",
        tone: "warning",
      },
      {
        id: "pro-3",
        title: "Completadas hoy",
        value: "4",
        helperText: "Muebles listos para despacho",
        trendLabel: "Meta diaria: 6",
        tone: "neutral",
      },
    ],
    activity: [
      {
        id: "pro-a1",
        title: "Orden OP-2026-219",
        subtitle: "Ropero empotrado cedro",
        status: "en_produccion",
        dateLabel: "Inicio hoy 08:05",
      },
      {
        id: "pro-a2",
        title: "Orden OP-2026-204",
        subtitle: "Cómoda nogal 6 cajones",
        status: "listo_entrega",
        dateLabel: "Terminada hoy 11:22",
      },
      {
        id: "pro-a3",
        title: "Orden OP-2026-199",
        subtitle: "Zapatera vertical blanca",
        status: "confirmado",
        dateLabel: "Programada para mañana",
      },
    ],
  },
}
