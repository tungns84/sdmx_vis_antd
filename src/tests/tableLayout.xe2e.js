import { expect, test } from '../../../.playwright/farso-fixture.js';
import {
  changeVibe,
  testidSelector,
  getTableLayout,
  getCustomizeLayout,
  waitForTransition,
  waitForResponse,
} from './utils.js';
import * as R from 'ramda';

test('table layout customization', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020`;
    await page.goto(url);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('table default layout', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: ['MEASURE'],
      header: ['TIME_PERIOD'],
      rows: ['LOCATION'],
    });
  });
  await test.step('no layout entry should be put in url', async () => {
    const url = await page.url();
    expect(url).not.toContain('ly[rs]');
    expect(url).not.toContain('ly[rw]');
    expect(url).not.toContain('ly[cl]');
  });
  await test.step('open LOCATION filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="LOCATION-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });
  await test.step('select AUS', async () => {
    await page.waitForSelector(testidSelector('value_AUS'));
    const val = await page.$(testidSelector('value_AUS'));
    await val.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await waitForResponse(page, expect, '/data/OECD,SNA_TABLE1,1.0/AUS..', () =>
      applyButton.click(),
    );
  });
  await test.step('table updated layout', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    expect(await getTableLayout(page)).toEqual({
      sections: [],
      header: ['TIME_PERIOD'],
      rows: ['MEASURE'],
    });
  });
  await test.step('no layout entry should be put in url', async () => {
    const url = await page.url();
    expect(url).not.toContain('ly[rs]');
    expect(url).not.toContain('ly[rw]');
    expect(url).not.toContain('ly[cl]');
  });
  await test.step('open LOCATION filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="LOCATION-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });
  await test.step('deselect AUS', async () => {
    await page.waitForSelector(testidSelector('value_AUS'));
    const val = await page.$(testidSelector('value_AUS'));
    await val.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await waitForResponse(page, expect, '/data/OECD,SNA_TABLE1,1.0/all', () =>
      applyButton.click(),
    );
  });
  await test.step('click on customize button', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const customizeButton = await toolbar.$(testidSelector('customize'));
    await customizeButton.click();
  });
  await test.step('wait for table layout menu to be opened', async () => {
    await page.waitForSelector(testidSelector('table-layout-test-id'));
  });
  await test.step('single value in rows should not be draggable', async () => {
    // only way found to test non draggability through the cursor style
    const rowDraggable = await page.$(testidSelector('draggable-LOCATION'));
    expect(
      await page.evaluate(
        (element) =>
          window.getComputedStyle(element).getPropertyValue('cursor'),
        rowDraggable,
      ),
    ).toEqual('no-drop');
  });
  await test.step('change table layout: MEASURE into rows', async () => {
    const origin = page.locator(testidSelector('draggable-MEASURE'));
    const destination = page.locator(testidSelector('droppable-rows'));
    await origin.dragTo(destination);
  });
  await test.step('multi values in rows are now draggable', async () => {
    const rowsDroppable = await page.$(testidSelector('droppable-rows'));
    expect(
      await rowsDroppable.$$eval('div', (nodes) =>
        nodes.map((n) => window.getComputedStyle(n).getPropertyValue('cursor')),
      ),
    ).toEqual(['grab', 'grab']);
  });
  await test.step('change table layout: LOCATION into header and TIME_PERIOD into sections', async () => {
    const origin1 = page.locator(testidSelector('draggable-LOCATION'));
    const destination1 = page.locator(testidSelector('droppable-sections'));
    await origin1.dragTo(destination1);

    const origin2 = page.locator(testidSelector('draggable-LOCATION'));
    const destination2 = page.locator(testidSelector('droppable-header'));
    await origin2.dragTo(destination2);

    const origin3 = page.locator(testidSelector('draggable-TIME_PERIOD'));
    const destination3 = page.locator(testidSelector('droppable-sections'));
    await origin3.dragTo(destination3);

    const applyButton = await page.$(testidSelector('table-layout-apply'));
    await applyButton.click();
  });
  await test.step('table updated layout', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: ['TIME_PERIOD'],
      header: ['LOCATION'],
      rows: ['MEASURE'],
    });
  });
  await test.step('layout should have been updated in the url', async () => {
    const url = await page.url();
    expect(url).toContain('ly[cl]=LOCATION');
    expect(url).toContain('ly[rs]=TIME_PERIOD');
    expect(url).toContain('ly[rw]=MEASURE');
  });
  await test.step('go on the overview page by the UI', async () => {
    const overviewButton = await page.$(testidSelector('overview-button'));
    await overviewButton.click();
    await page.waitForSelector('[id="id_overview_component"]');
  });
  await test.step('should have kept the layout in url', async () => {
    const url = await page.url();
    expect(url).toContain('ly[cl]=LOCATION');
    expect(url).toContain('ly[rs]=TIME_PERIOD');
    expect(url).toContain('ly[rw]=MEASURE');
  });
  await test.step('return to table view', async () => {
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('open LOCATION filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="LOCATION-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });
  await test.step('select AUS', async () => {
    await page.waitForSelector(testidSelector('value_AUS'));
    const val = await page.$(testidSelector('value_AUS'));
    await val.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await waitForResponse(page, expect, '/data/OECD,SNA_TABLE1,1.0/AUS..', () =>
      applyButton.click(),
    );
  });
  await test.step('table layout should be updated without LOCATION', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    expect(await getTableLayout(page)).toEqual({
      sections: ['TIME_PERIOD'],
      header: [],
      rows: ['MEASURE'],
    });
  });
  await test.step('should have kept the same layout in url', async () => {
    const url = await page.url();
    expect(url).toContain('ly[cl]=LOCATION');
    expect(url).toContain('ly[rs]=TIME_PERIOD');
    expect(url).toContain('ly[rw]=MEASURE');
  });
  await test.step('open LOCATION filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="LOCATION-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
  });
  await test.step('deselect AUS', async () => {
    await page.waitForSelector(testidSelector('value_AUS'));
    const val = await page.$(testidSelector('value_AUS'));
    await val.click();
    const applyButton = await page.$('button[id="apply_button"]');
    await waitForResponse(page, expect, '/data/OECD,SNA_TABLE1,1.0/all', () =>
      applyButton.click(),
    );
  });
  await test.step('LOCATION should go back into previous customized header and not default rows', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    expect(await getTableLayout(page)).toEqual({
      sections: ['TIME_PERIOD'],
      header: ['LOCATION'],
      rows: ['MEASURE'],
    });
  });
});

test('table layout combinations', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('nsi')('qna_comb')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0&vw=tb&ly[rs]=REF_SECTOR&ly[rw]=MEASURE&ly[cl]=TIME_PERIOD`;
    await page.goto(url);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('should render a table with 2 combinations in rows', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: ['REF_SECTOR'],
      header: ['TIME_PERIOD'],
      rows: ['COMBINED_MEASURE', 'COMBINED_UNIT_MEASURE'],
    });
  });
  await test.step('table should have 1 combination COMBINED_STUFF in header', async () => {
    const headerCombinations = await page.$$eval(
      testidSelector('data-header-combination'),
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(headerCombinations).toEqual(['Combined stuff:']);
  });
  await test.step('table hierarchical display with empty line for missing parent in rows', async () => {
    const table = await await page.$(testidSelector('vis-table'));
    const lastSection = await table.$('tbody:last-of-type');
    const rows = await lastSection.$$('tr:not(:first-child)');
    const rowsContent = await Promise.all(
      rows.map(async (row) => {
        const headerContent = await row.$$eval('th > div > p', (nodes) =>
          nodes.map((n) => n.innerText),
        );
        const cellsContent = await row.$$eval('td > span', (nodes) =>
          nodes.map((n) => n.innerText),
        );
        return [headerContent, cellsContent];
      }),
    );
    expect(rowsContent).toEqual([
      [
        ['Gross domestic product at market prices', ''],
        ['', '', '', '', '', '', '', ''],
      ],
      [
        ['Domestic demand', ''],
        ['', '', '', '', '', '', '', ''],
      ],
      [
        [
          'Final consumption expenditure',
          'Current prices, Czech koruna, Millions',
        ],
        [
          '..',
          '..',
          '..',
          '385,273.0',
          '303,308.0',
          '325,880.0',
          '329,682.0',
          '403,886.0',
        ],
      ],
      [
        [
          'Individual consumption expenditure',
          'Current prices, Czech koruna, Millions',
        ],
        [
          '..',
          '..',
          '..',
          '224,486.0',
          '180,610.0',
          '191,251.0',
          '192,521.0',
          '234,271.0',
        ],
      ],
      [
        [
          'Collective consumption expenditure',
          'Current prices, Czech koruna, Millions',
        ],
        [
          '..',
          '..',
          '..',
          '160,787.0',
          '122,698.0',
          '134,629.0',
          '137,161.0',
          '169,615.0',
        ],
      ],
    ]);
  });
  await test.step('put REF_SECTOR from sections into rows', async () => {
    const toolbar = await page.$(testidSelector('detoolbar'));
    const customizeButton = await toolbar.$(testidSelector('customize'));
    await customizeButton.click();
    await page.waitForSelector(testidSelector('table-layout-test-id'));
    const origin = page.locator(testidSelector('draggable-REF_SECTOR'));
    const destination = page.locator(testidSelector('droppable-rows'));
    await origin.dragTo(destination);
    await page.waitForSelector(
      `${testidSelector('droppable-rows')} > ${testidSelector(
        'draggable-REF_SECTOR',
      )}`,
    );
    const applyButton = await page.$(testidSelector('table-layout-apply'));
    await applyButton.click();
  });
  await test.step('has drag and drop succeeded', async () => {
    const layout = await getCustomizeLayout(page);
    expect(layout).toEqual({
      sections: [],
      header: ['Time period'],
      rows: ['Combined measure'],
    });
  });
  await test.step('table should keep 2 combinations in rows', async () => {
    expect(await getTableLayout(page)).toEqual({
      sections: [],
      header: ['TIME_PERIOD'],
      rows: ['COMBINED_MEASURE', 'COMBINED_UNIT_MEASURE'],
    });
  });
  await test.step('every table footnotes should have a single unit mult entry', async () => {
    const footnotesSpans = await page.$$eval(
      `${testidSelector('cell-flags-footnotes-icon')} > span`,
      (nodes) => nodes.map((n) => n.textContent),
    );
    const invalidContents = R.reject(
      (span) => span === '* Unit multiplier: Millions',
      footnotesSpans,
    );
    expect(invalidContents).toEqual([]);
  });
  await test.step('switch display from rows to header', async () => {
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0&vw=tb&ly[cl]=REF_SECTOR,MEASURE&ly[rw]=TIME_PERIOD`;
    await page.goto(url);
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('empty columns for missing parents', async () => {
    const table = await await page.$(testidSelector('vis-table'));
    const lastSection = await table.$('tbody');
    const rows = await lastSection.$$('tr:not(:first-child)');
    const rowsContent = await Promise.all(
      rows.map(async (row) => {
        const cellsContent = await row.$$eval('td > span', (nodes) =>
          nodes.map((n) => n.innerText),
        );
        return cellsContent;
      }),
    );
    const contentInColumns = R.transpose(rowsContent);
    expect([contentInColumns[7], contentInColumns[9]]).toEqual([
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
    ]);
  });
});
