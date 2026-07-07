import type { ContactDetails } from '../pages/contact.page';

const baseContact = {
  forename: 'Ling',
  email: 'ling.automation@example.com',
} as const;

export const contactData = {
  validation: {
    ...baseContact,
    message: 'Planit technical assessment validation test.',
  },
  submission: {
    ...baseContact,
    message: 'Planit technical assessment successful submission test.',
  },
} as const satisfies Record<'validation' | 'submission', ContactDetails>;
