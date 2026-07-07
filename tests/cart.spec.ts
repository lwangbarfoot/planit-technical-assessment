import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { NavigationComponent } from '../pages/navigation.component';
import { ShopPage } from '../pages/shop.page';
import { productOrders } from '../test-data/products';
import { parseMoneyToCents } from '../utils/money';

test('test case 3 - cart prices, subtotals and total are correct', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const navigation = new NavigationComponent(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);

  await test.step('Buy the requested product quantities', async () => {
    await homePage.open();
    await navigation.goToShop();

    for (const product of productOrders) {
      await shopPage.buy(product.name, product.quantity);
    }
  });

  await test.step('Open the cart and verify every line item', async () => {
    await navigation.goToCart();
    await expect(cartPage.cartRows).toHaveCount(productOrders.length);

    for (const product of productOrders) {
      const row = cartPage.rowFor(product.name);
      const currencyCells = row.locator('td').filter({ hasText: '$' });

      await expect(row).toHaveCount(1);
      await expect(cartPage.quantityFor(product.name)).toHaveValue(
        product.quantity.toString(),
      );
      await expect(currencyCells).toHaveCount(2);

      const priceText = await currencyCells.nth(0).innerText();
      const subtotalText = await currencyCells.nth(1).innerText();

      expect(parseMoneyToCents(priceText)).toBe(product.unitPriceCents);
      expect(parseMoneyToCents(subtotalText)).toBe(
        product.unitPriceCents * product.quantity,
      );
    }
  });

  await test.step('Verify total equals the sum of all subtotals', async () => {
    const expectedTotalCents = productOrders.reduce(
      (total, product) =>
        total + product.unitPriceCents * product.quantity,
      0,
    );
    const displayedTotalCents = parseMoneyToCents(
      await cartPage.total.innerText(),
    );

    expect(displayedTotalCents).toBe(expectedTotalCents);
  });
});
