import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('time period and frequency selections', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('freq')(servers);
    const url = `/vis?lc=en&df[ds]=hybrid&df[id]=DSD_PRICES%40DF_PRICES_ALL&df[ag]=OECD.SDD.TPS&df[vs]=1.0&av=true&pd=2009%2C2010&dq=.A...IX._T..&ly[rw]=REF_AREA&ly[cl]=TIME_PERIOD&ly[rs]=METHODOLOGY&to[TIME_PERIOD]=false&vw=tb`;
    await page.goto(url);
  });

  await test.step('load the viz and open Time Period and frequency filter', async () => {
    await page.waitForSelector(
      `${testidSelector(
        'PANEL_PERIOD-tab',
      )}[aria-label="Frequency of observation & Time period"]`,
    );

    const filter = await page.waitForSelector(
      'div[aria-label="Frequency of observation & Time period"]',
    );
    await filter.click();
  });

  await test.step('check current frequency ', async () => {
    await page.waitForSelector(
      testidSelector('period-picker-frequency-test-id'),
    );
    const freq = await page.waitForSelector(`button[aria-label="Annual"]`);
    const currentFreq = await freq.evaluate((el) =>
      el.getAttribute('aria-pressed'),
    );
    expect(currentFreq).toEqual('A');
  });

  await test.step('select freq Monthly', async () => {
    const buttonCount = await page.$$eval(
      'div[data-testid="period-picker-frequency-test-id"] > button',
      (li) => li.length,
    );
    expect(buttonCount).toEqual(3);
    const freqM = await page.$(`div> button[aria-label="Monthly"]`);
    await freqM.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await applyButton.click();
    await page.waitForSelector(
      `${testidSelector('deleteChip-test-id')}[aria-label="Monthly"]`,
    );
  });

  await test.step('url should contain updated time format and dataquery', async () => {
    const url = await page.url();
    expect(url).toContain('dq=.M...IX._T..');
    expect(url).toContain('pd=2009-01%2C2010-12');
  });

  await test.step('load url in annual and last 5 periods selection', async () => {
    const nextUrl = `/vis?lc=en&df[ds]=hybrid&df[id]=DSD_PRICES%40DF_PRICES_ALL&df[ag]=OECD.SDD.TPS&df[vs]=1.0&av=true&dq=.A...IX._T..&vw=tb&lo=5&lom=LASTNPERIODS`;
    await page.goto(nextUrl);
  });

  await test.step('load the viz and open Time Period and frequency filter', async () => {
    await page.waitForSelector(
      `${testidSelector('PANEL_PERIOD-tab')}[role="tab"]`,
    );
    const filter = await page.waitForSelector(
      'div[aria-label="Frequency of observation & Time period"]',
    );
    await filter.click();
  });

  await test.step('select freq Monthly', async () => {
    await page.waitForSelector(
      testidSelector('period-picker-frequency-test-id'),
    );
    const freqM = await page.$(`div> button[aria-label="Monthly"]`);
    await freqM.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await applyButton.click();
    await page.waitForSelector(
      `${testidSelector('deleteChip-test-id')}[aria-label="Monthly"]`,
    );
  });

  await test.step('url should contain updated time format and keep last 5 periods selection', async () => {
    const url = await page.url();
    expect(url).toContain('dq=.M...IX._T..');
    expect(url).toContain('lo=5&lom=LASTNPERIODS');
  });
});
