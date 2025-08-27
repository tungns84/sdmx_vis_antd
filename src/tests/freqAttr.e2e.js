import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('vis page flow with multi freq attributes', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('freqAttr')(servers);

    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DF_AIR_EMISSIONS&df[ag]=OECD&df[vs]=2.1&vw=tb`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const component = page.locator(testidSelector('vis-table'));
    await expect(component).toBeVisible();
  });
});
