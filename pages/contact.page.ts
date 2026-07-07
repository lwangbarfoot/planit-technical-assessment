import { expect, type Locator, type Page } from '@playwright/test';

export interface ContactDetails {
  forename: string;
  email: string;
  message: string;
}

export class ContactPage {
  readonly forenameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitLink: Locator;
  readonly forenameRequiredError: Locator;
  readonly emailRequiredError: Locator;
  readonly messageRequiredError: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.forenameInput = page.getByLabel('Forename *', { exact: true });
    this.emailInput = page.getByLabel('Email *', { exact: true });
    this.messageInput = page.getByLabel('Message *', { exact: true });
    this.submitLink = page.getByRole('link', { name: 'Submit', exact: true });
    this.forenameRequiredError = page.locator('#forename-err');
    this.emailRequiredError = page.locator('#email-err');
    this.messageRequiredError = page.locator('#message-err');
    this.successAlert = page.locator('.alert-success');
  }

  async submit(): Promise<void> {
    await this.submitLink.click();
  }

  async fillMandatoryFields(details: ContactDetails): Promise<void> {
    await this.forenameInput.fill(details.forename);
    await this.emailInput.fill(details.email);
    await this.messageInput.fill(details.message);
  }

  async submitForm(details: ContactDetails): Promise<void> {
    await this.fillMandatoryFields(details);
    await this.submit();
  }

  async expectMandatoryErrorsVisible(): Promise<void> {
    await expect(this.forenameRequiredError).toHaveText('Forename is required');
    await expect(this.emailRequiredError).toHaveText('Email is required');
    await expect(this.messageRequiredError).toHaveText('Message is required');
  }

  async expectMandatoryErrorsHidden(): Promise<void> {
    await expect(this.forenameRequiredError).toBeHidden();
    await expect(this.emailRequiredError).toBeHidden();
    await expect(this.messageRequiredError).toBeHidden();
  }

  async expectSubmissionSuccess(name: string): Promise<void> {
    await expect(this.successAlert).toContainText(
      `Thanks ${name}, we appreciate your feedback.`,
      { timeout: 30_000 },
    );
  }
}
