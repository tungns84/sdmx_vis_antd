import { expect, test } from '../../../.playwright/farso-fixture';
import {
  changeVibe,
  itShouldFindNbResults,
  testidSelector,
  getTableLayout,
} from './utils.js';

test('back browser flow', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await changeVibe('nsi')('sna')(servers);
    await page.goto(`?tm=external&pg=0&snb=1`);
  });
  await test.step('should load the search results page and find 2 results', async () => {
    itShouldFindNbResults({ page, expect, nb: 2 });
  });
  await test.step('should find regular dataflow and open it', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:SNA_TABLE1')} a`,
    );
    await externalDFLink.click();
  });
  await test.step('should display table', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('go back to search by browser', async () => {
    await page.goBack();
  });
  await test.step('open external dataflow', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    await changeVibe('nsi')('qna_comb')(servers);
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:DSD_QNA_COMB@DF_QNA_COMB_EXT')} a`,
    );
    await externalDFLink.click();
  });
  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual(
      'Quarterly GDP - expenditure approach (combined measure test)',
    );
  });
  await test.step('should diplay correct filters', async () => {
    const filtersLables = await page.$$eval('div[role="tab"]', (nodes) =>
      nodes.map((n) => n.ariaLabel),
    );
    expect(filtersLables).toEqual([
      'Time period',
      'Reporting institutional sector',
      'Measure',
    ]);
  });
  await test.step('should have correct layout', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: [],
      header: ['TIME_PERIOD'],
      rows: ['COMBINED_MEASURE', 'COMBINED_UNIT_MEASURE'],
    });
  });
  await test.step('back to search by browser', async () => {
    await page.goBack();
  });
  await test.step('reopen first dataflow', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    await changeVibe('nsi')('sna')(servers);
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:SNA_TABLE1')} a`,
    );
    await externalDFLink.click();
  });
  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual('1. Gross domestic product (GDP)');
  });
  await test.step('should diplay correct filters', async () => {
    const filtersLabels = await page.$$eval('div[role="tab"]', (nodes) =>
      nodes.map((n) => n.ariaLabel),
    );
    expect(filtersLabels).toEqual([
      'Year',
      'Country',
      'Transaction',
      'Measure',
    ]);
  });
  await test.step('should have correct layout', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: ['MEASURE'],
      header: ['TIME_PERIOD'],
      rows: ['LOCATION'],
    });
  });
});
