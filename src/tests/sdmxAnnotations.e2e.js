import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, getTableLayout } from './utils.js';

test('vis: not display annotations appliance', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('itcs')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_ITCS_HS2012%40DF_ITCS_HS2012&df[ag]=OECD.PAC.DCMI&df[vs]=1.0&av=true&pd=2018%2C2021&dq=.W.HS12_TOTAL...A&ly[rw]=REF_AREA&ly[cl]=TIME_PERIOD%2CTRADE_FLOW&vw=tb&lb=id&to[TIME_PERIOD]=false`;
    await page.goto(url);
  });

  await test.step('should not display frequency in used filters', async () => {
    await page.waitForSelector(testidSelector('usedFilters-vis-test-id'));
    const usedFilters = await page.$(testidSelector('usedFilters-vis-test-id'));
    expect(
      await usedFilters.$$eval(testidSelector('chips-test-id'), (nodes) =>
        nodes.map((n) => n.ariaLabel),
      ),
    ).not.toContain('FREQ:');
  });

  await test.step('switch to table view', async () => {
    await page.waitForSelector(testidSelector('table-button'));
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should not display frequency in the header', async () => {
    await page.waitForSelector(testidSelector('data-header'));
    const dataHeader = await page.$(testidSelector('data-header'));
    expect(
      await dataHeader.$$eval(testidSelector('data-header-subtitle'), (nodes) =>
        nodes.map((n) => n.ariaLabel),
      ),
    ).not.toContain('FREQ:');
  });

  await test.step('should not display TRADE_FLOW but keep REF_AREA in table', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: [],
      header: ['TIME_PERIOD'],
      rows: ['REF_AREA'],
    });
  });

  await test.step('should not have TRADE_FLOW but have REF_AREA in filters', async () => {
    const filters = await page.$$eval('div[role="tab"]', (nodes) =>
      nodes.map((n) => n.ariaLabel),
    );
    expect(filters).not.toContain('TRADE_FLOW');
    expect(filters).toContain('REF_AREA');
  });
});
