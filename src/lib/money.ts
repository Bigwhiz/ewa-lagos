// Prices are whole naira stored as integers. Integers add up exactly; floats don't (0.1 + 0.2 !== 0.3).
const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  return naira.format(amount);
}
