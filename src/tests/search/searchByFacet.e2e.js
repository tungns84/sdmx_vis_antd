import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from '../utils';

test.describe('search suite', () => {
  let page;
  let searchRequests = [];
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      if (method !== 'OPTIONS' && url.includes('api/search?tenant=oecd')) {
        searchRequests.push(request);
      }
    });
  });

  test('search by facet', async ({ servers }) => {
    await test.step('load the homepage', async () => {
      await changeVibe('config')('main')(servers);
      await changeVibe('sfs')('oecd')(servers);
      await page.goto(`?tenant=oecd:de`);
    });

    await test.step('should open the facet Topic', async () => {
      await page.waitForSelector(testidSelector('collapseButton_Topic'));
      await page.click(testidSelector('collapseButton_Topic'));
    });

    await test.step('should click on the facet value Industry', async () => {
      await page.evaluate(() => {
        document
          .querySelector(
            '[data-testid="collapseButton_Topic_value_0|Government#GOV#"]',
          )
          .click();
      });
    });

    await test.step("should find 'Core government results' in the results", async () => {
      await page.waitForSelector(
        testidSelector('ds:qa:stable:DF_GOV_CORE_RESULTS'),
      );
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('Core government results');
    });

    await test.step("should find 'Open government data' in the results", async () => {
      await page.waitForSelector(testidSelector('ds:qa:stable:DF_GOV_OG'));
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('Open government data');
    });

    await test.step("should open the current filters and find 'Topic' and 'Government'", async () => {
      await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('Topic');
      expect(text).toContain('Government');
    });

    await test.step('should request search exactly twice', () => {
      expect(searchRequests.length).toBe(2);
    });
  });
});
