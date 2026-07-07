import { expect, test } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';
import { HomePage } from '../pages/home.page';
import { NavigationComponent } from '../pages/navigation.component';

test('test case 2 - successful contact submission @stability', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const navigation = new NavigationComponent(page);
  const contactPage = new ContactPage(page);

  await homePage.open();
  await navigation.goToContact();
  await contactPage.fillMandatoryFields({
    forename: 'Ling',
    email: 'ling.automation@example.com',
    message: 'Planit technical assessment successful submission test.',
  });
  await contactPage.submit();

  await expect(contactPage.successAlert).toContainText(
    'Thanks Ling, we appreciate your feedback.',
    { timeout: 30_000 },
  );
});
