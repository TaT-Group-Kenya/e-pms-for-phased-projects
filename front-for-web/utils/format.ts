export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${month} ${day}, ${year} ${hours}:${paddedMinutes} ${ampm}`;
}
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
