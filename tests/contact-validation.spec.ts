import { expect, test } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';
import { HomePage } from '../pages/home.page';
import { NavigationComponent } from '../pages/navigation.component';

test('test case 1 - mandatory contact errors clear after valid input', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const navigation = new NavigationComponent(page);
  const contactPage = new ContactPage(page);

  await test.step('Navigate from Home to Contact', async () => {
    await homePage.open();
    await navigation.goToContact();
    await expect(page).toHaveURL(/#\/contact$/);
  });

  await test.step('Submit an empty form and verify mandatory errors', async () => {
    await contactPage.submit();

    await expect(contactPage.forenameRequiredError).toHaveText(
      'Forename is required',
    );
    await expect(contactPage.emailRequiredError).toHaveText('Email is required');
    await expect(contactPage.messageRequiredError).toHaveText(
      'Message is required',
    );
  });

  await test.step('Populate mandatory fields and verify errors are gone', async () => {
    await contactPage.fillMandatoryFields({
      forename: 'Ling',
      email: 'ling.automation@example.com',
      message: 'Planit technical assessment validation test.',
    });

    await expect(contactPage.forenameRequiredError).toBeHidden();
    await expect(contactPage.emailRequiredError).toBeHidden();
    await expect(contactPage.messageRequiredError).toBeHidden();
  });
});
