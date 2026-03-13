export const formatCurrency = (value: number, currency: string) => {
    if (Number.isNaN(value)) return '-'
    if(!currency) return value.toFixed(2);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency ? currency : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0)
}

export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KES'
}

export const currencyStrength: Record<string, number> = {
  KES: 1, 
  USD: 2, 
  EUR: 3, 
  GBP: 4 
};
