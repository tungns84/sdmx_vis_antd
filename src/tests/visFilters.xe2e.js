import { expect, test } from '../../../.playwright/farso-fixture.js';
import {
  changeVibe,
  testidSelector,
  waitForResponse,
  waitForTransition,
} from './utils.js';
import * as R from 'ramda';

test.describe('vis suite', () => {
  let page;
  let hasRequestedTimeAvailability = false;
  let hasRequestedDataAvailability = false;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    page.on('request', (req) => {
      const url = req.url();
      if (R.includes('/availableconstraint', url)) {
        if (R.endsWith('/TIME_PERIOD', url)) {
          hasRequestedTimeAvailability = true;
        } else {
          hasRequestedDataAvailability = true;
        }
      }
    });
  });

  test('vis Filters: hierarchical selections', async ({ servers, page }) => {
    await test.step('load the viz page and wait for data request', async () => {
      await changeVibe('config')('main')(servers);
      await changeVibe('nsi')('crs1')(servers);
      const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=1.0&av=true&pd=2019%2C2020&&dq=AUS........A`;
      await waitForResponse(page, expect, '/data/', () => page.goto(url));
      await page.waitForSelector(testidSelector('vis-table'));
    });

    await test.step('available constraint should have been performed', async () => {
      expect(hasRequestedDataAvailability).toEqual(true);
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('CEEC value should be disabled', async () => {
      const isValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      expect(isValueDisabled).toEqual('true');
    });

    await test.step('select albania', async () => {
      const albaniaValue = await page.$(testidSelector('value_CEEC.ALB'));
      await albaniaValue.click();
    });

    await test.step('CEEC value not disabled anymore', async () => {
      const isValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      expect(isValueDisabled).toEqual('false');
    });

    await test.step('select CEEC', async () => {
      const ceecValue = await page.$(testidSelector('value_CEEC'));
      await ceecValue.click();
      const applyButton = await page.$('button[id="apply_button"]');
      await applyButton.click();
      await page.waitForSelector(
        `${testidSelector('deleteChip-test-id')}[aria-label="Albania"]`,
      );
      await page.waitForSelector(
        `${testidSelector('deleteChip-test-id')}[aria-label="CEEC"]`,
      );
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('deselect Albania', async () => {
      const albaniaValue = await page.$(testidSelector('value_CEEC.ALB'));
      await albaniaValue.click();
      const applyButton = await page.$('button[id="apply_button"]');
      await applyButton.click();
    });

    await test.step('CEEC should be deselected as well and re-disabled', async () => {
      const usedFilters = await page.$(
        testidSelector('usedFilters-vis-test-id'),
      );
      const usedFiltersLabels = await usedFilters.$$eval(
        testidSelector('deleteChip-test-id'),
        (nodes) => nodes.map((n) => n.ariaLabel),
      );
      expect(usedFiltersLabels).not.toContain('CEEC');
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('CEEC should be deselected as well and re-disabled', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('CEEC');
      const ceecValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      expect(ceecValueDisabled).toEqual('true');
    });

    await test.step('open selection mode menu', async () => {
      const button = await page.$(
        `button[aria-label="Item and all items directly below"]`,
      );
      await button.click();
    });

    await test.step('new url to ALWAYS_DISPLAY_PARENTS version', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=2.0&av=true&pd=2019%2C2020&&dq=AUS........A`;
      await page.goto(nextUrl);
    });

    await test.step('load the viz and open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('CEEC value should be disabled', async () => {
      const isValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      expect(isValueDisabled).toEqual('true');
    });

    await test.step('select albania', async () => {
      const albaniaValue = await page.$(testidSelector('value_CEEC.ALB'));
      await albaniaValue.click();
      const applyButton = await page.$('button[id="apply_button"]');
      await applyButton.click();
      await page.waitForSelector(
        `${testidSelector('deleteChip-test-id')}[aria-label="Albania"]`,
      );
    });

    await test.step('all hierarchical parents should be selected', async () => {
      const ceecDeleteChip = await page.$(
        `${testidSelector('deleteChip-test-id')}[aria-label="CEEC"]`,
      );
      const dpgcDeleteChip = await page.$(
        `${testidSelector(
          'deleteChip-test-id',
        )}[aria-label="Developing countries"]`,
      );
      const eDeleteChip = await page.$(
        `${testidSelector('deleteChip-test-id')}[aria-label="Europe"]`,
      );

      expect([ceecDeleteChip, dpgcDeleteChip, eDeleteChip]).not.toContain(null);
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('all hierarchical parents should be disabled', async () => {
      const isCEECValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      const isDPGCValueDisabled = await page.$eval(
        testidSelector('value_DPGC'),
        (node) => node.ariaDisabled,
      );
      const isEValueDisabled = await page.$eval(
        testidSelector('value_DPGC.E'),
        (node) => node.ariaDisabled,
      );
      expect([
        isCEECValueDisabled,
        isDPGCValueDisabled,
        isEValueDisabled,
      ]).not.toContain('false');
    });

    await test.step('new url to ALWAYS_DISPLAY_PARENTS on level 2 version', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=3.0&av=true&pd=2019%2C2020&&dq=AUS........A`;
      await page.goto(nextUrl);
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('select albania', async () => {
      const albaniaValue = await page.$(testidSelector('value_CEEC.ALB'));
      await albaniaValue.click();
    });

    await test.step('only "Europe" parents should be disabled', async () => {
      const isEValueDisabled = await page.$eval(
        testidSelector('value_DPGC.E'),
        (node) => node.ariaDisabled,
      );
      expect(isEValueDisabled).toEqual('true');
    });

    await test.step('"Albania" and only "Europe" parents should be selected', async () => {
      const applyButton = await page.$('button[id="apply_button"]');
      await applyButton.click();
      await page.waitForSelector(
        `${testidSelector('deleteChip-test-id')}[aria-label="Albania"]`,
      );
      const ceecDeleteChip = await page.$(
        `${testidSelector('deleteChip-test-id')}[aria-label="CEEC"]`,
      );
      const dpgcDeleteChip = await page.$(
        `${testidSelector(
          'deleteChip-test-id',
        )}[aria-label="Developing countries"]`,
      );
      const eDeleteChip = await page.$(
        `${testidSelector('deleteChip-test-id')}[aria-label="Europe"]`,
      );
      expect(ceecDeleteChip).toEqual(null);
      expect(dpgcDeleteChip).toEqual(null);
      expect(eDeleteChip).not.toEqual(null);
    });

    await test.step('new url to DISABLE_AVAILABILITY_REQUESTS version', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=4.0&av=true&dq=AUS........A`;
      hasRequestedTimeAvailability = false;
      hasRequestedDataAvailability = false;
      await waitForResponse(page, expect, '/data/', () => page.goto(nextUrl));
      await page.waitForSelector(testidSelector('vis-table'));
    });

    await test.step('should have requested for time availability but not data availability', () => {
      expect(hasRequestedDataAvailability).toEqual(false);
      expect(hasRequestedTimeAvailability).toEqual(true);
    });

    await test.step('should display disclaimer in header', async () => {
      const disclaimer = await page.$(testidSelector('data-header-disclaimer'));
      expect(disclaimer).not.toEqual(null);
    });

    await test.step('open RECIPIENT filter', async () => {
      await page.evaluate(() => {
        document.querySelector('[data-testid="RECIPIENT-tab"]').click();
      });
      await waitForTransition(
        page,
        `${testidSelector('filter_panel')}[role="tabpanel"]`,
      );
    });

    await test.step('type "albania" in the spotlight', async () => {
      const spotlight = await page.$(`${testidSelector('spotlight')}`);
      await spotlight.click();
      await page.keyboard.type('albania');
    });

    await test.step('CEEC value should not be disabled', async () => {
      const isValueDisabled = await page.$eval(
        testidSelector('value_CEEC'),
        (node) => node.ariaDisabled,
      );
      expect(isValueDisabled).toEqual('false');
    });

    await test.step('new url to hierarchical level default selection on simple codelist', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=5.0&av=true`;
      await waitForResponse(page, expect, '/data/', () => page.goto(nextUrl));
      await page.waitForSelector(testidSelector('vis-table'));
    });

    await test.step('should have selected all Level 2 values', async () => {
      const values = await page.$$eval(
        testidSelector('deleteChip-test-id'),
        (nodes) => nodes.map((n) => n.ariaLabel),
      );

      expect(values).toEqual(
        expect.arrayContaining([
          'Azerbaijan',
          'Bulgaria',
          'Croatia',
          'Cyprus',
          'Kazakhstan',
          'Kuwait',
          'Liechtenstein',
          'Malta',
          'Qatar',
          'Romania',
          'Saudi Arabia',
          'Chinese Taipei',
          'Thailand',
          'United Arab Emirates',
        ]),
      );
      expect(values).not.toContain('Non-OECD economies');
    });

    await test.step('new url to hierarchical level default selection on simple codelist mixed with ALWAYS_DISPLAY_PARENTS', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=6.0&av=true`;
      await waitForResponse(page, expect, '/data/', () => page.goto(nextUrl));
      await page.waitForSelector(testidSelector('vis-table'));
    });

    await test.step('should have selected all Level 2 values and parent', async () => {
      const values = await page.$$eval(
        testidSelector('deleteChip-test-id'),
        (nodes) => nodes.map((n) => n.ariaLabel),
      );

      expect(values).toEqual(
        expect.arrayContaining([
          'Azerbaijan',
          'Bulgaria',
          'Croatia',
          'Cyprus',
          'Kazakhstan',
          'Kuwait',
          'Liechtenstein',
          'Malta',
          'Qatar',
          'Romania',
          'Saudi Arabia',
          'Chinese Taipei',
          'Thailand',
          'United Arab Emirates',
          'Non-OECD economies',
        ]),
      );
    });

    await test.step('new url to hierarchical level default selection on hierarchical codelist', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=7.0`;
      await waitForResponse(page, expect, '/data/', () => page.goto(nextUrl));
      await page.waitForSelector(testidSelector('vis-table'));
    });

    await test.step('should have selected all available Level 1 values', async () => {
      const values = await page.$$eval(
        testidSelector('deleteChip-test-id'),
        (nodes) => nodes.map((n) => n.ariaLabel),
      );

      expect(values).toEqual(expect.arrayContaining(['Developing countries']));
    });

    await test.step('new url to hierarchical level default selection on hierarchical codelist', async () => {
      const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=8.0`;
      await waitForResponse(
        page,
        expect,
        '/data/OECD.DCD,DSD_CRS@DF_CRS1,8.0/.A+DPGC+ACP+BLZ+CRI+SLV+GTM+HND+MEX+NIC+PAN+ATG+CUB+DMA+DOM+GRD+HTI+JAM+MSR+LCA+VCT.......A',
        () => page.goto(nextUrl),
      );
      await page.waitForSelector(testidSelector('vis-table'));
    });
  });
});
