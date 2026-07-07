import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductOrder } from '../test-data/products';
import { parseMoneyToCents } from '../utils/money';

export class CartPage {
  readonly cartRows: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.cartRows = page.locator('tbody tr.cart-item');
    this.total = page.locator('.total');
  }

  rowFor(productName: string): Locator {
    return this.cartRows.filter({ hasText: productName });
  }

  quantityFor(productName: string): Locator {
    return this.rowFor(productName).locator('input[name="quantity"]');
  }

  async expectProductLineItem(productOrder: ProductOrder): Promise<void> {
    const row = this.rowFor(productOrder.name);
    const currencyCells = row.locator('td').filter({ hasText: '$' });

    await expect(row).toHaveCount(1);
    await expect(this.quantityFor(productOrder.name)).toHaveValue(
      productOrder.quantity.toString(),
    );
    await expect(currencyCells).toHaveCount(2);

    const priceText = await currencyCells.nth(0).innerText();
    const subtotalText = await currencyCells.nth(1).innerText();

    expect(parseMoneyToCents(priceText)).toBe(productOrder.unitPriceCents);
    expect(parseMoneyToCents(subtotalText)).toBe(
      productOrder.unitPriceCents * productOrder.quantity,
    );
  }

  async expectCartContents(productOrders: readonly ProductOrder[]): Promise<void> {
    await expect(this.cartRows).toHaveCount(productOrders.length);

    for (const product of productOrders) {
      await this.expectProductLineItem(product);
    }
  }

  async expectTotal(productOrders: readonly ProductOrder[]): Promise<void> {
    const expectedTotalCents = productOrders.reduce(
      (total, product) => total + product.unitPriceCents * product.quantity,
      0,
    );
    const displayedTotalCents = parseMoneyToCents(await this.total.innerText());

    expect(displayedTotalCents).toBe(expectedTotalCents);
  }
}
