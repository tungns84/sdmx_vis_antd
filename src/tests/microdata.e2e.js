import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, waitForResponse } from './utils.js';
import * as R from 'ramda';

test('microdata table', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('ddown')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should display disabled microdata button in toolbar', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const hasDisabledMicrodataButton = await toolbar.$eval(
      '[id="microdata"]',
      (button) => button.disabled,
    );
    expect(hasDisabledMicrodataButton).toEqual(true);
  });

  await test.step('click obs cell hyperlink', async () => {
    const cell = await page.$('td[headers="REF_AREA=TUR_0_0 2_0 MEASURE=GDO"]');
    const hyperlink = await cell.$('.MuiLink-underlineAlways');
    await hyperlink.click();
  });

  await test.step('should display appropriate microdata table', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2022');
  });

  await test.step('microdata button is not disabled anymore', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const hasDisabledMicrodataButton = await toolbar.$eval(
      '[id="microdata"]',
      (button) => button.disabled,
    );
    expect(hasDisabledMicrodataButton).toEqual(false);
  });

  await test.step('go back to table', async () => {
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('previous table should be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('microdata button is still not disabled', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const hasDisabledMicrodataButton = await toolbar.$eval(
      '[id="microdata"]',
      (button) => button.disabled,
    );
    expect(hasDisabledMicrodataButton).toEqual(false);
  });

  await test.step('microdata button click', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const microdataButton = await toolbar.$('[id="microdata"]');
    await microdataButton.click();
  });

  await test.step('should return to microdata table', async () => {
    await page.waitForSelector(testidSelector('microdata-table'));
  });

  await test.step('microdata hierarchical content', async () => {
    const table = await page.$(testidSelector('microdata-table'));
    const tableContent = await table.$$eval('td', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    const hierarchicalColumn = R.pipe(
      R.splitEvery(10),
      R.map(R.nth(4)),
      R.unnest,
    )(tableContent);
    expect(hierarchicalColumn).toEqual([
      'ROOT_VALUE_1',

      '·  LEVEL_1_VALUE_1',

      '·  ·  LEVEL_2_VALUE_1',

      '·  ·  LEVEL_2_VALUE_2',

      '·  LEVEL_1_VALUE_2',
      'ROOT_VALUE_2',
      'ROOT_VALUE_3',
      'ROOT_VALUE_1',

      '·  LEVEL_1_VALUE_1',

      '·  ·  LEVEL_2_VALUE_1',
    ]);
  });

  await test.step('go back to table', async () => {
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('click other obs cell hyperlink', async () => {
    const cell = await page.$('td[headers="REF_AREA=TUR_0_0 3_0 MEASURE=GDO"]');
    const hyperlink = await cell.$('.MuiLink-underlineAlways');
    await hyperlink.click();
  });

  await test.step('should display appropriate microdata table', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2023');
  });

  await test.step('go back to table', async () => {
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });
  await test.step('return to initial microdata table', async () => {
    const cell = await page.$('td[headers="REF_AREA=TUR_0_0 2_0 MEASURE=GDO"]');
    const hyperlink = await cell.$('.MuiLink-underlineAlways');
    await hyperlink.click();
  });

  await test.step('initial microdata table is back', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2022');
  });

  await test.step('go back to table', async () => {
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('return to second microdata table', async () => {
    const cell = await page.$('td[headers="REF_AREA=TUR_0_0 3_0 MEASURE=GDO"]');
    const hyperlink = await cell.$('.MuiLink-underlineAlways');
    await hyperlink.click();
  });

  await test.step('second microdata table is back', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2023');
  });

  await test.step('browser back to initial microdata table', async () => {
    await page.evaluate(() => {
      history.go(-2);
    });
  });

  await test.step('initial microdata table is back', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2022');
  });

  await test.step('browser forward to second microdata table', async () => {
    await page.evaluate(() => {
      history.go(2);
    });
  });

  await test.step('second microdata table is back', async () => {
    const table = await page.waitForSelector(testidSelector('microdata-table'));
    const tableFirstTimeCell = await table.$eval(
      'tr > td',
      (n) => n.textContent,
    );
    expect(tableFirstTimeCell).toEqual('2023');
  });

  await test.step('open data downloads', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="downloads-button"]').click();
    });
  });

  await test.step('should have not disabled filtered data link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const optionIsDisabled = await menu.$eval(
      'a[id="csv.selection"]',
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger filtered microdata request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));

    await waitForResponse(
      page,
      expect,
      '/data/OECD.DAF,DSD_DEBT_TRANS_DDOWN@DF_DDOWN,1.0/.TUR......GDO.DD.',
      () =>
        page.evaluate(() => {
          document.querySelector('a[id="csv.selection"]').click();
        }),
      R.T,
      (params) =>
        params.get('startPeriod') === '2023' &&
        params.get('endPeriod') === '2023' &&
        params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    expect(info).not.toEqual(null);
  });

  await test.step('reopen data downloads', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="downloads-button"]').click();
    });
  });

  await test.step('should have disabled full data and metadata links', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const fullDataOptionIsDisabled = await menu.$eval(
      'a[id="csv.all"]',
      (n) => n.ariaDisabled,
    );
    const fullMetadataOptionIsDisabled = await menu.$eval(
      'a[id="metadata.all"]',
      (n) => n.ariaDisabled,
    );
    expect(fullDataOptionIsDisabled).toEqual('true');
    expect(fullMetadataOptionIsDisabled).toEqual('true');
  });
});
