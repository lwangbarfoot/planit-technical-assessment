import { expect, test } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';
import { HomePage } from '../pages/home.page';
import { NavigationComponent } from '../pages/navigation.component';

const contactData = {
  submission: {
    forename: 'Ling',
    email: 'ling.automation@example.com',
    message: 'Planit technical assessment successful submission test.',
  },
};

const submissionSuccessTimeoutMs =
  Number.parseInt(process.env.SUBMISSION_TIMEOUT_MS ?? '30000', 10) || 30_000;

test('test case 2 - successful contact submission @stability', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const navigation = new NavigationComponent(page);
  const contactPage = new ContactPage(page);

  await homePage.open();
  await navigation.goToContact();
  await contactPage.submitForm({
    forename: contactData.submission.forename,
    email: contactData.submission.email,
    message: contactData.submission.message,
  });

  await expect(contactPage.successAlert).toContainText(
    `Thanks ${contactData.submission.forename}, we appreciate your feedback.`,
    { timeout: submissionSuccessTimeoutMs },
  );
});
