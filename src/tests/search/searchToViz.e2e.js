import { expect, test } from '../../../../.playwright/farso-fixture';
import {
  changeVibe,
  testidSelector,
  itShouldFindNbResults,
  itShouldFindNbCells,
} from '../utils';
import * as R from 'ramda';

test('search results to viz page', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await changeVibe('nsi')('oecd')(servers);
    const url = `?tenant=oecd:de&fs[0]=Topic%2C0%7CEconomy%23ECO%23&fs[1]=Reference%20area%2C0%7CFrance%23FR%23&pg=0&fc=search-used&snb=11`;
    await page.goto(url);
  });

  await test.step('should load the search results page and find 11 results', async () => {
    await itShouldFindNbResults({ page, expect, nb: 11 });
  });

  await test.step('should not find go back link', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    expect(link).toEqual(null);
  });

  await test.step("should click on 'Economic Outlook No 106 (new structure)'", async () => {
    const selector = testidSelector('ds-demo-release:DF_EO_N');
    await page.waitForSelector(selector);
    await page.click(`${selector} a`);
  });

  await test.step('should load the viz page and see a table (configured) with 50 of cells', async () => {
    await page.waitForSelector('#id_viewer_component');
    await itShouldFindNbCells({ page, expect, nb: 50 });
  });

  await test.step("should not find 'Topic' in the filters (not a facet)", async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const texts = await page.$$eval(
      `${testidSelector('chips-test-id')} > span:first-child`,
      (nodes) => nodes.map((n) => n.textContent),
    );
    expect(texts).not.toContain('Topic:');
  });

  await test.step("should find 'Reference Area' set to 'France' in the filters (from facet)", async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const FiltersTexts = await page.$$eval(
      `${testidSelector('chips-test-id')} > span:first-child`,
      (nodes) => nodes.map((n) => n.textContent),
    );
    const ValuesTexts = await page.$$eval(
      `${testidSelector('deleteChip-test-id')} > span:first-child`,
      (nodes) => nodes.map((n) => n.textContent),
    );
    const texts = R.pipe(
      R.transpose,
      R.map(R.join(' ')),
    )([FiltersTexts, ValuesTexts]);
    expect(texts).toContain('Reference area: France');
  });

  await test.step("should find 'Frequency' in the filters (single value)", async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const texts = await page.$$eval(
      `${testidSelector('chips-test-id')} > span:first-child`,
      (nodes) => nodes.map((n) => n.textContent),
    );
    expect(texts).toContain('Frequency of observation:');
  });

  await test.step('should find go back to search link', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    expect(link).not.toEqual(null);
  });

  await test.step('clicking the link should go back to search page', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
    await itShouldFindNbResults({ page, expect, nb: 11 });
  });

  await test.step('should not find go back link', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    expect(link).toEqual(null);
  });
});
