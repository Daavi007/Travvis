export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function installment(price: number, times = 5) {
  return Math.round((price / times) * 100) / 100;
}

export function pixPrice(price: number) {
  return Math.max(0, Math.round((price - 10) * 100) / 100);
}
