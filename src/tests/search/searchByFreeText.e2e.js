import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from '../utils';
import * as R from 'ramda';

// if style is not found, expect fails
const expectHighlightStyleHelper = (style = {}) => {
  expect(R.prop('backgroundColor', style)).toEqual('rgb(255, 255, 0)');
  expect(R.prop('borderBottomColor', style)).toEqual('rgb(140, 200, 65)');
  expect(R.prop('borderBottomWidth', style)).toEqual('2px');
  expect(R.prop('borderBottomStyle', style)).toEqual('solid');
};

test('search by free text', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await page.goto(`?tenant=oecd:de`);
  });

  await test.step('load the homepage', async () => {
    await page.waitForSelector(testidSelector('spotlight_input'));
  });

  await test.step("type 'tourism' in the free text search and press 'enter' key", async () => {
    await page.click(testidSelector('spotlight_input'));
    await page.keyboard.type('tourism');
    await page.keyboard.press('Enter');
  });

  await test.step('should find the expected dataflow in the results', async () => {
    await page.waitForSelector(
      testidSelector('ds-demo-release:ENT_EMP@TOURISM_KEY'),
    );
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Enterprises and employment in tourism');
  });

  await test.step('should have 4 highlights in the results', async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const markTags = await page.$$(`${testidSelector('search_results')} mark`);
    expect(R.length(markTags)).toEqual(4);
  });

  await test.step("should have 'tourism' highlighted in the title (style checked)", async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const style = await page.evaluate(() => {
      const tags = document
        .querySelector(
          '[data-testid="ds-demo-release:ENT_EMP@TOURISM_KEY_title"]',
        )
        .getElementsByTagName('mark');
      return JSON.parse(JSON.stringify(getComputedStyle(tags[0])));
    });
    expectHighlightStyleHelper(style);
  });

  await test.step("should have 'tourism' highlighted in the activity attribute (style checked)", async () => {
    await page.waitForSelector(testidSelector('search_results'));
    const style = await page.evaluate(() => {
      const tags = document
        .querySelector(
          '[data-testid="ds-demo-release:ENT_EMP@TOURISM_KEY_highlight_Activity"]',
        )
        .getElementsByTagName('mark');
      return JSON.parse(JSON.stringify(getComputedStyle(tags[0])));
    });
    expectHighlightStyleHelper(style);
  });
});
