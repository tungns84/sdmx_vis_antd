import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, waitForTransition } from '../utils';

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

  await test.step('should load the results', async () => {
    await page.waitForSelector(
      testidSelector('ds-demo-release:ENT_EMP@TOURISM_KEY'),
    );
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Enterprises and employment in tourism');
  });

  await test.step("click on locale 'Français'", async () => {
    await page.click('#languages');
    await waitForTransition(page, 'div#menu- > div:nth-child(3)');
    await page.click('li#fr');
  });

  await test.step('should go back to the homepage in French', async () => {
    await page.waitForSelector(testidSelector('collapseButton_Thème'));
  });

  await test.step("should open the facet Topic and find at least 'Société'", async () => {
    await page.click(testidSelector('collapseButton_Thème'));
    await page.waitForSelector(
      testidSelector('collapseButton_Thème_value_0|Éducation#EDU#'),
    );
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Société');
  });
});
