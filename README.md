# Planit Technical Assessment - Jupiter Toys

This repository contains a Playwright + TypeScript solution for the Planit
Automation Test Engineer/Consultant take-home assessment.

## Why Playwright

Playwright is an open-source browser automation framework with a first-party
test runner, web-first assertions, automatic actionability waiting, isolated
browser contexts, trace diagnostics and straightforward CI integration.
TypeScript adds compile-time feedback while keeping the test intent concise.

The solution deliberately avoids fixed sleeps, positional product selectors
and test retries. A failure should remain visible rather than be hidden by a
retry.

## Automated scenarios

1. Submit an empty Contact form, verify mandatory validation messages, populate
   the required fields and verify the messages disappear.
2. Populate and submit the Contact form and verify the success message. This
   scenario is configured with `repeatEach: 5` to demonstrate five independent
   successful executions.
3. Buy the requested products and verify quantity, unit price, subtotal and
   calculated cart total.

Expected cart calculation:

| Product | Quantity | Unit price | Subtotal |
| --- | ---: | ---: | ---: |
| Stuffed Frog | 2 | $10.99 | $21.98 |
| Fluffy Bunny | 5 | $9.99 | $49.95 |
| Valentine Bear | 3 | $14.99 | $44.97 |
| **Total** | | | **$116.90** |

Currency strings are converted to integer cents before comparison to avoid
floating-point rounding errors.

## Project structure

```text
pages/          Page and reusable navigation objects
test-data/      Typed test data
tests/          Executable assessment scenarios
utils/          Domain helpers such as currency parsing
.github/        GitHub Actions pipeline
```

Page objects contain locators and user actions. Assertions remain in the test
specifications so that expected behaviour stays visible to the reader.

## Prerequisites

- Node.js 20 or later
- pnpm 11 (enable it with `corepack enable` if it is not already available)

## Install and run

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` executes the two core scenarios once and the successful submission
scenario five times. Useful focused commands are:

```bash
pnpm test:core
pnpm test:stability
pnpm test:headed
pnpm check
pnpm report
```

The target can be overridden without changing source code:

```bash
BASE_URL=https://jupiter.cloud.planittesting.com pnpm test
```

## Reporting and diagnostics

- Console list reporter for CI readability
- HTML report generated in `playwright-report/`
- Trace, screenshot and video retained for failures in `test-results/`
- GitHub Actions report uploaded as a downloadable workflow artifact

## CI design

The GitHub Actions workflow installs locked dependencies and Chromium, performs
TypeScript and ESLint checks, runs the complete suite and uploads the HTML
report even when a test fails. CI uses one worker to avoid placing unnecessary
parallel load on the shared public assessment environment.

## Assumptions

- The tools named in the assessment are examples; the instruction permits an
  open-source UI automation tool of the candidate's choice.
- Chromium coverage is sufficient for the assessment. Additional Playwright
  browser projects can be enabled without changing the tests.
- The public application is a shared test environment, so the tests do not
  depend on persistent server-side data or execution order.
