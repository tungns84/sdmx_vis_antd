import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, waitForResponse, waitForTransition } from './utils.js';

test('vis page: switch locale', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('qna_comb')(servers);
  });

  await test.step('load the viz page and wait for the correct default data request in english then display table', async () => {
    const url = `/vis?tenant=oecd:de&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0`;
    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE............',
      () => page.goto(url),
      (headers) => headers['accept-language'] === 'en',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('open MEASURE filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="MEASURE-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });

  await test.step('select Gross domestic products at market prices', async () => {
    const option = await page.$(testidSelector('value_B1GQ'));
    await option.click();
    const applyButton = await page.$('button[id="apply_button"]');

    await waitForResponse(
      page, expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE....B1GQ........',
      () => applyButton.click(),
      (headers) => headers['accept-language'] === 'en',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('switch to french', async () => {
    const localesButton = await page.$('div[id="languages"]');
    await localesButton.click();
    const frenchOption = await page.$('li[id="fr"]');

    await waitForResponse(
      page, expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE....B1GQ........',
      () => frenchOption.click(),
      (headers) => headers['accept-language'] === 'fr',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('switch back to english', async () => {
    const localesButton = await page.$('div[id="languages"]');
    await localesButton.click();
    const englishOption = await page.$('li[id="en"]');

    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE....B1GQ........',
      () => englishOption.click(),
      (headers) => headers['accept-language'] === 'en',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('reload default url', async () => {
    const nextUrl = `/vis?tenant=oecd:de&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0`;
    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE............',
      () => page.goto(nextUrl),
      (headers) => headers['accept-language'] === 'en',
    );
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('switch to french', async () => {
    const localesButton = await page.$('div[id="languages"]');
    await localesButton.click();
    const frenchOption = await page.$('li[id="fr"]');

    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE............',
      () => frenchOption.click(),
      (headers) => headers['accept-language'] === 'fr',
    );
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('open MEASURE filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="MEASURE-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });

  await test.step('select Gross domestic products at market prices', async () => {
    const option = await page.$(testidSelector('value_B1GQ'));
    await option.click();
    const applyButton = await page.$('button[id="apply_button"]');

    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE....B1GQ........',
      () => applyButton.click(),
      (headers) => headers['accept-language'] === 'fr',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('switch back to english', async () => {
    const localesButton = await page.$('div[id="languages"]');
    await localesButton.click();
    const englishOption = await page.$('li[id="en"]');

    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE....B1GQ........',
      () => englishOption.click(),
      (headers) => headers['accept-language'] === 'en',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('dataquery shoud have been preserved in url', async () => {
    const url = await page.url();
    expect(url).toContain('dq=Q.CZE....B1GQ........');
  });

  await test.step('reload default url with fr default locale in settings', async () => {
    await changeVibe('config')('main:fr')(servers);
    const nextUrl = `/vis?tenant=oecd:de&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0`;
    await waitForResponse(
      page,
      expect,
      '/data/OECD.SDD.NAD,DSD_QNA_COMB@DF_QNA_COMB,1.0/Q.CZE............',
      () => page.goto(nextUrl),
      (headers) => headers['accept-language'] === 'fr',
    );

    await page.waitForSelector(testidSelector('vis-table'));
  });
});
