export default () => ({
  port: Number(process.env.PORT ?? 3000),
  defaultTaxRate: Number(process.env.DEFAULT_TAX_RATE ?? 0.18),
  allowDeliveryWithPendingBalance: process.env.ALLOW_DELIVERY_WITH_PENDING_BALANCE === 'true',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
});
