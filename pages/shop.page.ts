import type { Locator, Page } from '@playwright/test';

export class ShopPage {
  constructor(private readonly page: Page) {}

  productCard(productName: string): Locator {
    return this.page.locator('li.product').filter({ hasText: productName });
  }

  async buy(productName: string, quantity: number): Promise<void> {
    const buyLink = this.productCard(productName).getByRole('link', {
      name: 'Buy',
      exact: true,
    });

    for (let item = 0; item < quantity; item += 1) {
      await buyLink.click();
    }
  }
}
