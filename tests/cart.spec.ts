import { test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { NavigationComponent } from '../pages/navigation.component';
import { ShopPage } from '../pages/shop.page';
import { productOrders } from '../test-data/products';

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
    await cartPage.expectCartContents(productOrders);
  });

  await test.step('Verify total equals the sum of all subtotals', async () => {
    await cartPage.expectTotal(productOrders);
  });
});
