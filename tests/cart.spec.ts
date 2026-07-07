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
    await shopPage.buyProducts(productOrders);
  });

  await test.step('Open the cart and verify every line item', async () => {
    await navigation.goToCart();

    await expect(cartPage.cartRows).toHaveCount(productOrders.length);

    for (const productOrder of productOrders) {
      const row = cartPage.rowFor(productOrder.name);
      const currencyCells = cartPage.currencyCellsFor(productOrder.name);

      await expect(row).toHaveCount(1);
      await expect(cartPage.quantityFor(productOrder.name)).toHaveValue(
        productOrder.quantity.toString(),
      );
      await expect(currencyCells).toHaveCount(2);

      const unitPriceCell = currencyCells.nth(0);
      const subtotalCell = currencyCells.nth(1);
      const unitPriceText = await unitPriceCell.innerText();
      const subtotalText = await subtotalCell.innerText();

      expect(parseMoneyToCents(unitPriceText)).toBe(productOrder.unitPriceCents);
      expect(parseMoneyToCents(subtotalText)).toBe(
        productOrder.unitPriceCents * productOrder.quantity,
      );
    }
  });

  await test.step('Verify total equals the sum of all subtotals', async () => {
    const expectedTotalCents = productOrders.reduce(
      (total, productOrder) =>
        total + productOrder.unitPriceCents * productOrder.quantity,
      0,
    );
    const displayedTotalCents = parseMoneyToCents(await cartPage.total.innerText());

    expect(displayedTotalCents).toBe(expectedTotalCents);
  });
});
