import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from '../utils';
import { ID_HOME_PAGE } from '../../css-api/index';

test('reset search', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await page.goto(`?tenant=oecd:de`);
  });

  await test.step('load the homepage', async () => {
    await page.waitForSelector(testidSelector('collapseButton_Topic'));
  });

  await test.step('should open the facet Topic', async () => {
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

  await test.step("should open the current filters and click on 'clear all filters'", async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const clearAllSelector =
      "[data-testid='usedFilters-vis-test-id'] div:last-child div [data-testid='deleteChip-test-id'] span[role='button']:last-of-type";
    await page.waitForSelector(clearAllSelector);
    await page.click(clearAllSelector);
  });

  await test.step('should reset the search and go back to the homepage', async () => {
    await page.waitForSelector(testidSelector('spotlight_input'));
  });

  await test.step("type 'tourism' in the free text search and press 'enter' key", async () => {
    await page.click(testidSelector('spotlight_input'));
    await page.keyboard.type('tourism');
    await page.keyboard.press('Enter');
  });

  await test.step('should find the expected dataflow in the results', async () => {
    await page.waitForSelector(
      testidSelector('ds-demo-release:ENT_EMP@TOURISM_KEY'),
    );
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Enterprises and employment in tourism');
  });

  await test.step('clear the free text search', async () => {
    const selector = `${testidSelector('spotlight')} button:nth-of-type(2)`;
    await page.click(selector);
  });

  await test.step('should reset the search and go back to the homepage', async () => {
    await page.waitForSelector(`#${ID_HOME_PAGE}`);
  });
});
