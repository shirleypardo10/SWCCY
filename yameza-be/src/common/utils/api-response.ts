export const ok = <T>(message: string, data: T, meta?: Record<string, unknown>) => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
