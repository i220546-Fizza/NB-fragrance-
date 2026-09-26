export function formatCurrency(amount: number): string {
  if (Number.isNaN(amount)) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}
