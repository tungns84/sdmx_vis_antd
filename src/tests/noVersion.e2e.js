import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, waitForTransition } from './utils.js';

test('vis page: no version in url', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&av=true&vw=tb`;
    await page.goto(url);
  });

  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should have latest Dataflow name in header title', async () => {
    const headerTitleLabel = await page.$eval(
      testidSelector('data-header-title'),
      (node) => node.ariaLabel,
    );
    expect(headerTitleLabel).toEqual('Latest Dataflow');
  });

  await test.step('should have filter LOCATION name from latest structure', async () => {
    const locationFilterLabel = await page.$eval(
      `${testidSelector('LOCATION-tab')}[role="tab"]`,
      (node) => node.ariaLabel,
    );
    expect(locationFilterLabel).toEqual('Countries(Latest)');
  });

  await test.step('should have C value disabled in MEASURE filter (latest ACC)', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="MEASURE-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );
    const cValueIsDisabled = await page.$eval(
      testidSelector('value_C'),
      (node) => node.ariaDisabled,
    );
    expect(cValueIsDisabled).toEqual('true');
  });

  await test.step('should close the MEASURE filter', async () => {
    const closeHandle = await page.$('button[aria-label="Cancel"]');
    await closeHandle.click();
  });

  await test.step('should click on the first annotation and open the metadata panel', async () => {
    const annotationHandle = await page.$(testidSelector('ref-md-info'));
    await annotationHandle.click();
  });

  await test.step('should have latest metadata content in panel', async () => {
    const panel = await page.$(testidSelector('ref-md-panel'));
    const panelSpanLabels = await panel.$$eval('span', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    expect(panelSpanLabels).toContain('Boomerang');
  });
});
