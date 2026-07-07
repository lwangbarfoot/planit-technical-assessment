import type { Locator, Page } from '@playwright/test';

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

  currencyCellsFor(productName: string): Locator {
    return this.rowFor(productName).locator('td').filter({ hasText: '$' });
  }
}
