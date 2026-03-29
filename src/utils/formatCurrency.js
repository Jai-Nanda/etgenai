export function formatCurrency(
  amount,
  { locale = 'en-US', currency = 'USD', maximumFractionDigits = 0 } = {}
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(amount)
}
