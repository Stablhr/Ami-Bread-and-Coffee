/** Money helpers. Prices are stored in centavos (integer) everywhere. */

export function formatPeso(centavos: number): string {
  const hasCentavos = centavos % 100 !== 0;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: hasCentavos ? 2 : 0,
    maximumFractionDigits: 2
  }).format(centavos / 100);
}

export function pesosToCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

export function centavosToPesos(centavos: number): number {
  return centavos / 100;
}
