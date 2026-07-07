export function parseMoneyToCents(displayValue: string): number {
  const numericValue = displayValue.replace(/[^\d.-]/g, '');
  const amount = Number.parseFloat(numericValue);

  if (!Number.isFinite(amount)) {
    throw new Error(`Unable to parse monetary value: "${displayValue}"`);
  }

  return Math.round(amount * 100);
}
