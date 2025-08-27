import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, waitForTransition } from './utils.js';

test('default time periods selections', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('ddown')(servers);
    await page.goto(`/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb`);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('should have default start period 2020 selection from structure in url', async () => {
    const url = await page.url();
    expect(url).toContain('pd=2020%2C');
  });
  await test.step('load url with empty time selection', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb&pd=%2C`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('time selection should be kept empty', async () => {
    const url = await page.url();
    expect(url).toContain('pd=%2C');
  });
  await test.step('load url with lastnperiods', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb&lo=5&lom=LASTNPERIODS`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('no time selection should be in url and lastNPeriods kept', async () => {
    const url = await page.url();
    expect(url).not.toContain('pd');
    expect(url).toContain('lo=5&lom=LASTNPERIODS');
  });
  await test.step('load url with lastnobservations and without time selection', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb&lo=1&lom=LASTNOBSERVATIONS`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('time selection should be added in url and lastNObservations kept', async () => {
    const url = await page.url();
    expect(url).toContain('pd');
    expect(url).toContain('lo=1&lom=LASTNOBSERVATIONS');
  });
  await test.step('load url with lastnobservations and custom time selection', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb&lo=1&lom=LASTNOBSERVATIONS&pd=2017%2C2020`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('time selection and lastNObservations should be unchanged', async () => {
    const url = await page.url();
    expect(url).toContain('pd=2017%2C2020');
    expect(url).toContain('lo=1&lom=LASTNOBSERVATIONS');
  });
  await test.step('load url with lastnperiods and custom time selection', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb&lo=3&lom=LASTNPERIODS&pd=2017%2C2020`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('only time selection should be kept', async () => {
    const url = await page.url();
    expect(url).toContain('pd=2017%2C2020');
    expect(url).not.toContain('lo=');
    expect(url).not.toContain('lom=');
  });
  await test.step('switch to no frequency version and last n periods set to 6', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=2.0&vw=tb&lo=6&lom=LASTNPERIODS`;
    await page.goto(nextUrl);
  });
  await test.step('correct startPeriod query was made and table is successfully displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('switch to dataflow without default time selection in annotations', async () => {
    await changeVibe('nsi')('sna')(servers);
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&vw=tb`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('default last n periods from settings should be applied', async () => {
    const url = await page.url();
    expect(url).not.toContain('pd=');
    expect(url).toContain('lo=5');
    expect(url).toContain('lom=LASTNPERIODS');
  });
  await test.step('switch to last n observations in filter', async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="PANEL_PERIOD-tab"]').click();
    });
    await waitForTransition(
      page,
      `${testidSelector('filter_panel')}[role="tabpanel"]`,
    );

    await page.waitForSelector('input[id="time series value(s)_1"]');
    await page.evaluate(() => {
      document.querySelector('input[id="time series value(s)_1"]').click();
    });
    const applyButton = await page.$('button[id="apply_button"]');
    await applyButton.click();
  });
  await test.step('display updated table', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const tableTimePeriods = await page.$$eval(
      'th[headers="header_0"]',
      (nodes) => nodes.map((n) => n.textContent),
    );
    expect(tableTimePeriods).toEqual(['2023', '2024']);
  });
  await test.step('load url to last 2 observations without time selection', async () => {
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&vw=tb&lo=2&lom=LASTNOBSERVATIONS`;
    await page.goto(nextUrl);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('last 2 observations should be kept and empty time selection added ', async () => {
    const url = await page.url();
    expect(url).toContain('pd=%2C');
    expect(url).toContain('lo=2');
    expect(url).toContain('lom=LASTNOBSERVATIONS');
  });
});
