import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('charts: choro map', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    await page.goto(`/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020&vw=tb`);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('open chart menu', async () => {
    const chartButton = await page.$(testidSelector('chart-button'));
    await chartButton.click();
  });
  await test.step('select choro map option from chart menu', async () => {
    await page.waitForSelector(testidSelector('chart-menu'));
    await page.evaluate(() => {
      document
        .querySelector('[data-testid="map-world:countries-button"]')
        .click();
    });
  });
  await test.step('check Australia got colorizeded in the map', async () => {
    await page.waitForSelector('.rcw-chart__chart__areas');
    const areas = await page.$('.rcw-chart__chart__areas');
    const area = await areas.$(testidSelector('AU'));
    const fillColor = await area.$eval('path', (p) => p.style.fill);
    expect(fillColor).not.toEqual('rgb(255, 255, 255)');
  });
  await test.step('reload the page and check that charts still got rendered', async () => {
    await page.reload();
    await page.waitForSelector('.rcw-chart__chart__areas');
    const areas = await page.$('.rcw-chart__chart__areas');
    const area = await areas.$(testidSelector('CA'));
    const fillColor = await area.$eval('path', (p) => p.style.fill);
    expect(fillColor).not.toEqual('rgb(255, 255, 255)');
  });
});
