import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('Accessibility vis page: filters, applied filters, toolbar', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('nsi')('crs1')(servers);
    await page.goto(
      '/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=1.0&av=true&pd=2019%2C2020&&dq=AUS........A',
    );
  });

  await test.step('load the viz and open RECIPIENT filter (keyboard)', async () => {
    await page.waitForSelector('div[data-testid="RECIPIENT-tab"]');
    await page.focus('div[aria-label="Recipient"]');
    await page.keyboard.press('Enter');
    const ariaSelected = await page.$eval(
      testidSelector('RECIPIENT-tab'),
      el => el.getAttribute('aria-selected'),
    );
    expect(ariaSelected).toBe('true');
  });

  await test.step('type "albania" in the spotlight', async () => {
    const spotlight = await page.locator(testidSelector('spotlight'));
    await spotlight.locator(testidSelector('spotlight_input')).click();
    await page.keyboard.type('albania');
  });

  await test.step('select albania with keyboard', async () => {
    await page.focus('div[aria-label="Albania"]');
    await page.keyboard.press('Enter');
    await page.waitForSelector(
      `${testidSelector('value_DPGC.E.ALB')}[aria-checked="true"]`,
    );
  });

  await test.step('CEEC value not disabled anymore', async () => {
    const isValueDisabled = await page.$eval(
      testidSelector('value_CEEC'),
      node => node.getAttribute('aria-disabled'),
    );
    const ariaLabel = await page.$eval(
      testidSelector('value_CEEC'),
      node => node.getAttribute('aria-label'),
    );
    expect(isValueDisabled).toBe('false');
    expect(ariaLabel).toBe('No data with current filters for:  CEEC');
  });

  await test.step('deselect Albania', async () => {
    await page.locator(testidSelector('value_DPGC.E.ALB')).click();
    const ariaChecked = await page.$eval(
      testidSelector('value_DPGC.E.ALB'),
      node => node.getAttribute('aria-checked'),
    );
    expect(ariaChecked).toBe('false');
  });

  await test.step('toolbar should contain two lists', async () => {
    await page.locator(testidSelector('detoolbar'));
    const lists = await page.locator(`${testidSelector('detoolbar')} > div[role="list"]`).count();
    expect(lists).toBe(2);
  });

  await test.step('applied filters should be accessible', async () => {
    const usedFilters = await page.locator(testidSelector('usedFilters-vis-test-id'));
    await page.focus('span[aria-label="delete Australia"]');
    await page.keyboard.press('Enter');
    const usedFiltersLabels = await usedFilters.locator(testidSelector('deleteChip-test-id')).evaluateAll(
      nodes => nodes.map(n => n.getAttribute('aria-label')),
    );
    expect(usedFiltersLabels).not.toContain('Australia');
  });
});
