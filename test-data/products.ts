export interface ProductOrder {
  name: string;
  quantity: number;
  unitPriceCents: number;
}

export const productOrders: readonly ProductOrder[] = [
  { name: 'Stuffed Frog', quantity: 2, unitPriceCents: 1_099 },
  { name: 'Fluffy Bunny', quantity: 5, unitPriceCents: 999 },
  { name: 'Valentine Bear', quantity: 3, unitPriceCents: 1_499 },
];
