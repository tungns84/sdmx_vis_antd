import { expect, test } from '../../../.playwright/farso-fixture.js';
import { changeVibe, testidSelector, waitForResponse } from './utils.js';
import * as R from 'ramda';

test('sdmx data: range header check without warning limitation disclaimer', async ({
  servers,
  page,
}) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should not find the warning limitation disclaimer in the header', async () => {
    const disclaimer = await page.$(testidSelector('data-header-disclaimer'));
    expect(disclaimer).toBe(null);
  });

  await test.step('open data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled filtered data link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const optionIsDisabled = await page.$eval(
      'a[id="csv.selection"]',
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger filtered data request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/OECD,SNA_TABLE1,1.0/',
      () =>
        page.evaluate(() => {
          document.querySelector('a[id="csv.selection"]').click();
        }),
      R.T,
      (params) =>
        params.get('startPeriod') === '2019' &&
        params.get('endPeriod') === '2020' &&
        params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    expect(info).not.toEqual(null);
  });

  await test.step('close info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    const button = await info.$('button');
    await button.click();
  });

  await test.step('reopen data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled full data link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const optionIsDisabled = await menu.$eval(
      'a[id="csv.all"]',
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger full data request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/OECD,SNA_TABLE1,1.0/',
      () =>
        page.evaluate(() => {
          document.querySelector('a[id="csv.all"]').click();
        }),
      R.T,
      (params) =>
        params.get('startPeriod') !== '2019' &&
        params.get('endPeriod') !== '2020' &&
        params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    expect(info).not.toEqual(null);
  });

  await test.step('close info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    const button = await info.$('button');
    await button.click();
  });

  await test.step('reopen data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled full metadata link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const optionIsDisabled = await menu.$eval(
      'a[id="metadata.all"]',
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger send a full metadata request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/dataflow/OECD/SNA_TABLE1/1.0/',
      () =>
        page.evaluate(() => {
          document.querySelector('a[id="metadata.all"]').click();
        }),
      R.T,
      (params) => params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl info message', async () => {
    const info = await page.$(testidSelector('csv-dl-start'));
    expect(info).not.toEqual(null);
  });

  await test.step('deactivate csv links then reload', async () => {
    await changeVibe('config')('noCsvLink');
    await page.reload();
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('deactivate dl requests', async () => {
    await changeVibe('nsi')('sna:dl-error');
  });

  await test.step('open data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled filtered data link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = page.locator(testidSelector('downloads-menu'));

    const optionIsDisabled = await menu
      .locator(testidSelector('data.download.csv.selection-button'))
      .getAttribute('aria-disabled');

    expect(optionIsDisabled).toBe(null);
  });

  await test.step('click should send a filtered data request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/OECD,SNA_TABLE1,1.0/',
      () =>
        page.evaluate(() => {
          document
            .querySelector('[data-testid="data.download.csv.selection-button"]')
            .click();
        }),
      R.T,
      (params) =>
        params.get('format') === 'csvfilewithlabels' &&
        params.get('startPeriod') === '2019' &&
        params.get('endPeriod') === '2020',
    );
  });

  await test.step('should display dl error message', async () => {
    await page.waitForSelector(testidSelector('csv-dl-error'));
    const info = await page.$(testidSelector('csv-dl-error'));
    expect(info).not.toEqual(null);
  });

  await test.step('close info message', async () => {
    const info = await page.$(testidSelector('csv-dl-error'));
    const button = await info.$('button');
    await button.click();
  });

  await test.step('reopen data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled full data link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const optionIsDisabled = await menu.$eval(
      testidSelector('data.download.csv.all-button'),
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger full data request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/OECD,SNA_TABLE1,1.0/',
      () =>
        page.evaluate(() => {
          document
            .querySelector('[data-testid="data.download.csv.all-button"]')
            .click();
        }),
      R.T,
      (params) =>
        params.get('format') === 'csvfilewithlabels' &&
        params.get('startPeriod') !== '2019' &&
        params.get('endPeriod') !== '2020',
    );
  });

  await test.step('should display dl error message', async () => {
    await page.waitForSelector(testidSelector('csv-dl-error'));
    const info = await page.$(testidSelector('csv-dl-error'));
    expect(info).not.toEqual(null);
  });

  await test.step('close info message', async () => {
    const info = await page.$(testidSelector('csv-dl-error'));
    const button = await info.$('button');
    await button.click();
  });

  await test.step('reopen data downloads', async () => {
    const button = await page.$(testidSelector('downloads-button'));
    await button.click();
  });

  await test.step('should have not disabled full metadata link', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    const menu = await page.$(testidSelector('downloads-menu'));
    const optionIsDisabled = await menu.$eval(
      testidSelector('metadata.download.csv.all-button'),
      (n) => n.ariaDisabled,
    );
    expect(optionIsDisabled).toEqual(null);
  });

  await test.step('click should trigger send a full metadata request', async () => {
    await page.waitForSelector(testidSelector('downloads-menu'));
    await waitForResponse(
      page,
      expect,
      '/data/dataflow/OECD/SNA_TABLE1/1.0/',
      () =>
        page.evaluate(() => {
          document
            .querySelector('[data-testid="metadata.download.csv.all-button"]')
            .click();
        }),
      R.T,
      (params) => params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl error message', async () => {
    await page.waitForSelector(testidSelector('csv-dl-error'));
    const info = await page.$(testidSelector('csv-dl-error'));
    expect(info).not.toEqual(null);
  });

  await test.step('click on metadata button and open metadata side panel', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="ref-md-info"]').click();
    });
    await page.waitForSelector(testidSelector('ref-md-panel'));
  });

  await test.step('click on metadata selection dl button should send filtered metadata csv request', async () => {
    await page.waitForSelector(
      testidSelector('metadata.download.csv.selection-button'),
    );
    await waitForResponse(
      page,
      expect,
      '/data/dataflow/OECD/SNA_TABLE1/1.0/*.B1G_P119.*',
      () =>
        page.evaluate(() => {
          document
            .querySelector(
              '[data-testid="metadata.download.csv.selection-button"]',
            )
            .click();
        }),
      R.T,
      (params) => params.get('format') === 'csvfilewithlabels',
    );
  });

  await test.step('should display dl error message', async () => {
    await page.waitForSelector(
      testidSelector('metadata.download.csv.selection.error'),
    );
    const info = await page.$(
      testidSelector('metadata.download.csv.selection.error'),
    );
    expect(info).not.toEqual(null);
  });
});

test('sdmx data: too long requests', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna:too-long')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
});

test('sdmx data: range header check with warning limitation disclaimer', async ({
  servers,
  page,
}) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('range')(servers);
    await changeVibe('nsi')('sna:content-range')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should find the warning limitation disclaimer in the header', async () => {
    const disclaimer = await page.$(testidSelector('data-header-disclaimer'));
    expect(disclaimer).not.toBe(null);
  });
});
