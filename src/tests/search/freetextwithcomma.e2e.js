import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, itShouldFindNbResults, testidSelector } from '../utils';
import * as R from 'ramda';

test('search by free text', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await page.goto(`?tm=indicators%2C%202023%20edition&pg=0&snb=1`);
  });

  await test.step('should load the search results page and find 1 result', async () => {
    await itShouldFindNbResults({ page, expect, nb: 1 });
  });

  await test.step('should find the expected dataflow in the results', async () => {
    await page.waitForSelector(
      testidSelector('ds-demo-release:DSD_GOV_TDG_SPS_GPC@DF_GOV_SPS_2023'),
    );
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('indicators, 2023 edition');
    await page.waitForSelector(testidSelector('search_results'));
  });

  await test.step('should have 7 highlights in the results', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const markTags = await page.$$(`${testidSelector('search_results')} mark`);
    expect(R.length(markTags)).toEqual(7);
  });
});
