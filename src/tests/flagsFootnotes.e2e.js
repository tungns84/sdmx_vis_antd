import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';
import * as R from 'ramda';

test('vis: flags and footnotes display', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020`;
    await page.goto(url);
  });

  await test.step('switch to table view', async () => {
    await page.waitForSelector(testidSelector('table-button'));
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should find 20 flags icon in the page', async () => {
    const icons = await page.$$(testidSelector('cell-flags-footnotes-icon'));
    expect(R.length(icons)).toEqual(20);
  });

  await test.step('hover a flag icon should display tooltip', async () => {
    const iconHandle = await page.$(
      testidSelector('cell-flags-footnotes-icon'),
    );
    await iconHandle.hover();
    iconHandle.dispose();
    await page.waitForSelector(testidSelector('cell-flags-footnotes-content'));
    const tooltip = await page.$(
      testidSelector('cell-flags-footnotes-content'),
    );
    expect(tooltip).not.toBe(null);
  });
});
