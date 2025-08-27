import { expect, test } from '../../../.playwright/farso-fixture';
import {
  changeVibe,
  testidSelector,
  getTableLayout,
  waitForTransition,
} from './utils.js';

test('irregular time periods', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('irregular')(servers);
    const url = `/vis?tenant=oecd:de&lc=fr&df[ds]=hybrid&df[id]=DF_KEI&df[ag]=OECD&df[vs]=1.0&dq=.ARG..A&pd=2004%2C2009&vw=tb`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('table layout', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: [],
      header: ['TIME_PERIOD'],
      rows: ['SUBJECT'],
    });
  });

  await test.step('time periods header french labels', async () => {
    const labels = await page.$$eval('th[headers="header_0"]', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    expect(labels).toEqual([
      '2004',
      '2005',
      '2006 - 2007',
      '2006',
      'janv. - mars 2006',
      '2006-03-26T21:15:20.1000',
      '2007 - 2008',
      '2007',
      '2007-05-16 15:34:20 - 17:34:19',
      '2008',
      '2009',
    ]);
  });

  await test.step('switch locale to english', async () => {
    await page.click('#languages');
    await page.click('li#en');
  });

  await test.step('ascending order time periods header english labels', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const labels = await page.$$eval('th[headers="header_0"]', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    expect(labels).toEqual([
      '2004',
      '2005',
      '2006 - 2007',
      '2006',
      '2006-Jan - 2006-Mar',
      '2006-03-26T21:15:20.1000',
      '2007 - 2008',
      '2007',
      '2007-05-16 15:34:20 - 17:34:19',
      '2008',
      '2009',
    ]);
  });

  await test.step('switch time order to descending', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const customizeButton = await toolbar.$(testidSelector('customize'));
    await customizeButton.click();
    await page.waitForSelector(testidSelector('table-layout-test-id'));
    const timePeriodDragItem = await page.$(
      testidSelector('draggable-TIME_PERIOD'),
    );
    const timeOrderInput = await timePeriodDragItem.$('div[role="combobox"]');
    await timeOrderInput.click();
    const descendingValue = await page.$('li[data-value="descending"]');
    await descendingValue.click();
  });

  await test.step('descending order time periods header english labels', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const labels = await page.$$eval('th[headers="header_0"]', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    expect(labels).toEqual([
      '2009',
      '2008',
      '2007-05-16 15:34:20 - 17:34:19',
      '2007',
      '2007 - 2008',
      '2006-03-26T21:15:20.1000',
      '2006-Jan - 2006-Mar',
      '2006',
      '2006 - 2007',
      '2005',
      '2004',
    ]);
  });

  await test.step('period in applied filters chips', async () => {
    const appliedValuesChips = await page.$$eval(
      testidSelector('deleteChip-test-id'),
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(appliedValuesChips).toContain('Start: 2004');
    expect(appliedValuesChips).toContain('End: 2009');
  });

  await test.step('open time period filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="PANEL_PERIOD-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });
  await test.step('change time period start', async () => {
    const startInput = await page.$(testidSelector('year-Start-test-id'));
    await startInput.click();
    await waitForTransition(page, 'ul[aria-labelledby="year-Start-label"]');
  });

  await test.step('select 2007 value', async () => {
    const startOptionsList = await page.$(
      'ul[aria-labelledby="year-Start-label"]',
    );
    const inputValue = await startOptionsList.$('li[id="2007"]');
    await inputValue.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await applyButton.click();
    await page.waitForSelector(
      `${testidSelector('deleteChip-test-id')}[aria-label="Start: 2007"]`,
    );
  });

  await test.step('period updated in url', async () => {
    const url = await page.url();
    expect(url).toContain('pd=2007%2C2009');
  });

  await test.step('period updated in applied filters chips', async () => {
    const appliedValuesChips = await page.$$eval(
      testidSelector('deleteChip-test-id'),
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(appliedValuesChips).toContain('Start: 2007');
    expect(appliedValuesChips).toContain('End: 2009');
  });
});
