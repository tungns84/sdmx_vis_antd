import { playAudit } from 'playwright-lighthouse';
import { test } from '@playwright/test';
import playwright from 'playwright';

const urls = [
  { label: 'home page', url: 'https://de-qa.siscc.org', threshold: 85 },
  {
    label: 'search results (without filters!)',
    url: 'https://de-qa.siscc.org/?tm=Test%20a11y%20dataflow%20with%20second&pg=0&snb=1',
    threshold: 80,
  },
  {
    label: 'viz page (overview)',
    url: 'https://de-qa.siscc.org/vis?tm=Test%20a11y%20dataflow&pg=0&snb=1&vw=ov&df[ds]=ds%3Aqa%3Astable&df[id]=DF_TEST_ACCESSIBILITY&df[ag]=SISCC.A11Y&df[vs]=1.0&pd=2013%2C&dq=.A...&ly[rw]=MEASURE%2CUNIT_MEASURE&ly[cl]=TIME_PERIOD&ly[rs]=REF_AREA&to[TIME_PERIOD]=false',
    threshold: 75,
  },
  {
    label: 'viz page (table)',
    url: 'https://de-qa.siscc.org/vis?tm=Test%20a11y%20dataflow&pg=0&snb=1&vw=tb&df[ds]=ds%3Aqa%3Astable&df[id]=DF_TEST_ACCESSIBILITY&df[ag]=SISCC.A11Y&df[vs]=1.0&pd=2013%2C&dq=.A...&ly[rw]=MEASURE%2CUNIT_MEASURE&ly[cl]=TIME_PERIOD&ly[rs]=REF_AREA&to[TIME_PERIOD]=false',
    threshold: 70,
  },
];

test.describe('audit example', () => {
  for (const { label, url, threshold } of urls) {
    test(`should audit ${label}`, async () => {
      const browser = await playwright['chromium'].launch({
        args: ['--remote-debugging-port=9222'],
      });
      const page = await browser.newPage();
      await page.goto(url);
      await playAudit({
        page: page,
        thresholds: {
          performance: 5,
          accessibility: threshold,
          'best-practices': 95,
          seo: 50,
        },
        port: 9222,
      });
      await browser.close();
    });
  }
});
