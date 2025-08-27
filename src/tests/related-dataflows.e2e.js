import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('load indexed related (by DSD) dataflows', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('relatedDfs')(servers);
    const url = `/vis?df[ds]=ds-demo-release&df[id]=DF_ALL_TOURISM_TRIPS&df[ag]=OECD.CFE&df[vs]=5.0&hc[Activity]=Tourism&pd=%2C&dq=.......TDS..A&ly[cl]=TIME_PERIOD&ly[rs]=REPORTING_COUNTRY&ly[rw]=MEASURE%2CVISITOR_TYPE%2CACCOMMODATION_TYPE&to[TIME_PERIOD]=false&lo=5&lom=LASTNPERIODS&vw=ov`;
    await page.goto(url);
  });

  await test.step('load the overview page', async () => {
    await changeVibe('sfs')('oecd')(servers);
    await page.$('div[id="id_overview_component"]');
  });

  await test.step('should display related dataflows', async () => {
    const relatedDFs = await page.waitForSelector(
      testidSelector('complementaryData'),
    );
    const liCount = await relatedDFs.$$eval('ul > li', (li) => li.length);
    expect(liCount).toEqual(2);
  });

  await test.step('load index related through custom query', async () => {
    const nextUrl = `/vis?df[ds]=ds-demo-release&df[id]=DF_ALL_TOURISM_TRIPS&df[ag]=OECD.CFE&df[vs]=5.1&hc[Activity]=Tourism&pd=%2C&dq=.......TDS..A&ly[cl]=TIME_PERIOD&ly[rs]=REPORTING_COUNTRY&ly[rw]=MEASURE%2CVISITOR_TYPE%2CACCOMMODATION_TYPE&to[TIME_PERIOD]=false&lo=5&lom=LASTNPERIODS&vw=ov`;
    await page.goto(nextUrl);
  });

  await test.step('load the overview page', async () => {
    await page.$('div[id="id_overview_component"]');
  });

  await test.step('should display 3 related dataflows', async () => {
    const relatedDFs = await page.waitForSelector(
      testidSelector('complementaryData'),
    );
    const liCount = await relatedDFs.$$eval('ul > li', (li) => li.length);
    expect(liCount).toEqual(3);
  });
});
