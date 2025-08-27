import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe } from './utils';

test('playwright witness', async ({ servers, page }) => {
  await test.step('load', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
  });

  await test.step('dum', async () => {
    await page.goto('/?tenant=oecd:de');
    await page.waitForSelector('#id_home_page');
    await expect(page.locator('#root')).toContainText('Topic');
    await expect(page).toHaveTitle(/.Stat Data Explorer/);
  });

  await test.step('my', async () => {
    await expect(page).toHaveTitle(/.Stat Data Explorer/);
  });
});
