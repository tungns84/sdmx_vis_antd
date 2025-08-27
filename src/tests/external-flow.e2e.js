import { expect, test } from '../../../.playwright/farso-fixture';
import * as R from 'ramda';
import {
  changeVibe,
  itShouldFindNbResults,
  testidSelector,
  waitForResponse,
} from './utils.js';

test('external dataflow flow', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await changeVibe('nsi')('qna_comb')(servers);
    await page.goto(`?tm=external&pg=0&snb=1`);
  });

  await test.step('should load the search results page and find 2 results', async () => {
    await itShouldFindNbResults({ page, expect, nb: 2 });
  });

  await test.step('should find external dataflow and open it', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:DSD_QNA_COMB@DF_QNA_COMB_EXT')} a`,
    );

    const responseExt = await waitForResponse(
      page,
      expect,
      '/dataflow/OECD.SDD.NAD/DSD_QNA_COMB@DF_QNA_COMB_EXT/1.0',
      () => externalDFLink.click(),
      R.T,
      R.T,
      false,
    );
    await waitForResponse(
      page,
      expect,
      '/dataflow/OECD.SDD.NAD/DSD_QNA_COMB@DF_QNA_COMB/1.0',
      () => responseExt.status() === 200,
    );
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual(
      'Quarterly GDP - expenditure approach (combined measure test)',
    );
  });

  await test.step('go back to search results', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
  });

  await test.step('should find regular dataflow and open it', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    await changeVibe('nsi')('sna')(servers);
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:SNA_TABLE1')} a`,
    );
    await externalDFLink.click();
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual('1. Gross domestic product (GDP)');
  });

  await test.step('go back to search results', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
  });

  await test.step('reopen external dataflow', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    await changeVibe('nsi')('qna_comb')(servers);
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:DSD_QNA_COMB@DF_QNA_COMB_EXT')} a`,
    );
    await externalDFLink.click();
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual(
      'Quarterly GDP - expenditure approach (combined measure test)',
    );
  });

  await test.step('reload search page', async () => {
    await page.goto(`?tm=external&pg=0&snb=1`);
  });

  await test.step('should load the search results page and find 2 results', async () => {
    await itShouldFindNbResults({ page, expect, nb: 2 });
  });

  await test.step('should find regular dataflow and open it', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:SNA_TABLE1')} a`,
    );
    await changeVibe('nsi')('sna')(servers);
    await externalDFLink.click();
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual('1. Gross domestic product (GDP)');
  });

  await test.step('go back to search results', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
  });

  await test.step('reopen external dataflow', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    await changeVibe('nsi')('qna_comb')(servers);
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:DSD_QNA_COMB@DF_QNA_COMB_EXT')} a`,
    );
    await externalDFLink.click();
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual(
      'Quarterly GDP - expenditure approach (combined measure test)',
    );
  });

  await test.step('go back to search results', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
  });

  await test.step('reopen regular dataflow', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const externalDFLink = await page.$(
      `${testidSelector('ds-demo-release:SNA_TABLE1')} a`,
    );
    await changeVibe('nsi')('sna')(servers);
    await externalDFLink.click();
  });

  await test.step('should display correct header title', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    await page.waitForSelector(testidSelector('data-header-title'));
    const headerTitle = await page.$eval(
      testidSelector('data-header-title'),
      (n) => n.textContent,
    );
    expect(headerTitle).toEqual('1. Gross domestic product (GDP)');
  });
});
