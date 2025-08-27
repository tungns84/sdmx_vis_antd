import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, itShouldFindNbResults } from '../utils';
import { ID_HOME_PAGE } from '../../css-api/index';

const itShouldLoadTheHomePage = async ({ page }) => {
  await page.waitForSelector(`#${ID_HOME_PAGE}`);
};

test('search by facet', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    const url = `?tenant=oecd:de&fs[0]=Reference%20area%2C0%7CFrance%23FR%23&fs[1]=Reporting%20institutional%20sector%2C0%7CGeneral%20government%23S13%23&fs[2]=Stocks%2C0%7CBalance%20of%20primary%20incomes%23B5G%23&pg=0&fc=search-used&snb=2`;
    await page.goto(url);
  });

  await test.step(`should find 2 results`, async () => {
    await itShouldFindNbResults({ page, expect, nb: 2 });
  });

  await test.step("remove 'Stocks' facet in the current filters", async () => {
    await page.waitForSelector(testidSelector('chips-test-id'));
    const facetSelector =
      "[data-testid='chips-test-id'][aria-label='Stocks:'] span[role='button']:last-of-type";
    await page.waitForSelector(facetSelector);
    await page.click(facetSelector);
  });

  await test.step(`should find 5 results`, async () => {
    await itShouldFindNbResults({ page, expect, nb: 5 });
  });

  await test.step("should find the current filters and click on 'clear all filters'", async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const clearAllSelector =
      "[data-testid='clear-filters-test-id'] span[role='button']:last-of-type";
    await page.waitForSelector(clearAllSelector);
    await page.click(clearAllSelector);
  });

  await test.step(`should reset the search and go back to the homepage`, async () => {
    await itShouldLoadTheHomePage({ page });
  });
});
