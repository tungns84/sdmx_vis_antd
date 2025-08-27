import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('no time period tests', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('no_time')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=CEN18_HOU&df[ag]=STATSNZ&df[vs]=1.0&vw=tb&lo=5&lom=LASTNPERIODS`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should not display time related content in applied filters', async () => {
    const appliedChips = await page.$$eval(
      testidSelector('chips-test-id'),
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(appliedChips).toEqual([
      'Access to basic amenities:',
      'Sector of landlord:',
    ]);
  });

  await test.step('url should be cleaned of non relevant parameters', async () => {
    const url = await page.url();
    expect(url).not.toContain('lo=5');
    expect(url).not.toContain('lom=LASTNPERIODS');
  });

  await test.step('should not display time period filter', async () => {
    const timeFilterPanel = await page.$('div[id="PANEL_PERIOD"]');
    expect(timeFilterPanel).toBe(null);
  });

  await test.step('should find metadata info icon and click', async () => {
    const metadataHandle = await page.$(testidSelector('ref-md-info'));
    await metadataHandle.click();
    metadataHandle.dispose();
  });

  await test.step('should load and display the metadata', async () => {
    await page.waitForSelector(`${testidSelector('ref-md-panel')} > div > h5`);
    const metadataEntry = await page.$(
      `${testidSelector('ref-md-panel')} > div > h5`,
    );
    expect(metadataEntry).not.toBe(null);
  });
});
