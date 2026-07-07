import type { Locator, Page } from '@playwright/test';

export class NavigationComponent {
  readonly contactLink: Locator;
  readonly shopLink: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.contactLink = page.getByRole('link', {
      name: 'Contact',
      exact: true,
    });
    this.shopLink = page.getByRole('link', { name: 'Shop', exact: true });
    this.cartLink = page.locator('a[href="#/cart"]');
  }

  async goToContact(): Promise<void> {
    await this.contactLink.click();
  }

  async goToShop(): Promise<void> {
    await this.shopLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
