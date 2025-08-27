import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('vis: invalid annotations and display data from sdmx in combinations', async ({
  servers,
  page,
}) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('combinations')(servers);
    await changeVibe('nsi')('nase')(servers);
    await page.goto(
      '/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_NASEC20%40DF_T7II_Q&df[ag]=OECD.SDD.NAD&df[vs]=1.0&av=true&pd=%2C&dq=Q..AUS..S12L.S11......XDC......&ly[rw]=INSTR_ASSET%2CCOUNTERPART_SECTOR&ly[cl]=TIME_PERIOD&ly[rs]=SECTOR&to[TIME_PERIOD]=false&lo=5&lom=LASTNPERIODS&vw=tb',
    );
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const component = page.locator(testidSelector('vis-table'));
    await expect(component).toBeVisible();
  });
});
