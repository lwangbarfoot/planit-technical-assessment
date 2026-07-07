import type { Locator, Page } from '@playwright/test';
import type { ProductOrder } from '../test-data/products';

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

  async buyProducts(productOrders: readonly ProductOrder[]): Promise<void> {
    for (const product of productOrders) {
      await this.buy(product.name, product.quantity);
    }
  }
}
