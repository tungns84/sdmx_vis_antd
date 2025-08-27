import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';
import * as R from 'ramda';

test('referential metadata: basic usecase', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('sna')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=SNA_TABLE1&df[ag]=OECD&df[vs]=1.0&av=true&pd=2019%2C2020&dq=AUS%2BAUT%2BBEL%2BCAN%2BCHL.B1G_P119.V%2BC`;
    await page.goto(url);
  });

  await test.step('load the viz', async () => {
    await page.waitForSelector(testidSelector('table-button'));
    const tableButton = await page.$(testidSelector('table-button'));
    await tableButton.click();
  });

  await test.step('load the viz page with a table', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should find 4 annotations in the table', async () => {
    const annotations = await page.$$(testidSelector('ref-md-info'));
    expect(R.length(annotations)).toEqual(4);
  });

  await test.step('should click on the first annotation and open the metadata panel', async () => {
    const annotationHandle = await page.$(testidSelector('ref-md-info'));
    await annotationHandle.click();
  });

  await test.step('should load and display the metadata', async () => {
    const titleHandle = await page.waitForSelector(
      `${testidSelector('ref-md-panel')} > div > h5`,
    );
    const text = await page.evaluate((el) => el.textContent, titleHandle);
    expect(text).toContain('1. Gross domestic product (GDP)');
    await titleHandle.dispose();
  });

  await test.step('should not display advanced attributes', async () => {
    const panel = await page.$(testidSelector('ref-md-panel'));
    const buttonTexts = await panel.$$eval('button', (nodes) =>
      nodes.map((n) => n.textContent),
    );
    expect(buttonTexts).not.toContain('Data Characteristics');
  });

  await test.step('should close the metadata panel', async () => {
    const closeHandle = await page.$(
      `${testidSelector('ref-md-panel')} > .MuiBackdrop-root`,
    );
    await closeHandle.click();
  });

  await test.step('should not see the panel anymore', async () => {
    const panelHandle = await page.waitForSelector(
      testidSelector('ref-md-panel'),
    );
    expect(panelHandle).not.toBe(null);
    await panelHandle.dispose();
  });

  await test.step('should have metadata icon in section MEASURE=C', async () => {
    const section = await page.waitForSelector('th[id="MEASURE=C"]');
    const icon = await section.$(testidSelector('ref-md-info'));
    expect(icon).not.toBe(null);
  });

  await test.step('deactivate metadata and reload', async () => {
    await changeVibe('config')('no_metadata')(servers);
    await page.reload();
  });

  await test.step('should not find any icon in the table', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
    const annotations = await page.$$(testidSelector('ref-md-info'));
    expect(R.length(annotations)).toEqual(0);
  });
});

test('referential metadata: table layout usecases', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('qna_comb')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_QNA_COMB@DF_QNA_COMB&df[ag]=OECD.SDD.NAD&df[vs]=1.0&vw=tb&ly[rw]=MEASURE&ly[cl]=TIME_PERIOD&ly[rs]=REF_SECTOR`;
    await page.goto(url);
  });

  await test.step('load the viz page with a table', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });

  await test.step('should have metadata icon at S1 section level', async () => {
    const firstSection = await page.$('th[id="REF_SECTOR=S1"]');
    const metadataIcon = await firstSection.$(testidSelector('ref-md-info'));
    expect(metadataIcon).not.toBe(null);
  });

  await test.step('should have metadata icon at every P3 row  in all sections', async () => {
    const metadataIcons = await page.$$(
      `th[id*="MEASURE=P3"] ~ td > div > button${testidSelector(
        'ref-md-info',
      )}`,
    );
    expect(R.length(metadataIcons)).toEqual(5);
  });

  await test.step('should have metadata icon at 2022-Q4 column level', async () => {
    const metadataIconsAriaLabels = await page.$$eval(
      `thead > tr:last-child > td > ${testidSelector('ref-md-info')}`,
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(R.length(metadataIconsAriaLabels)).toEqual(1);
    expect(R.head(metadataIconsAriaLabels)).toContain('2022-Q4');
  });

  await test.step('should have metadata icon at row P72 only for section S1', async () => {
    const metadataIconsAriaLabels = await page.$$eval(
      `th[id*="MEASURE=P72"] ~ td > div > button${testidSelector(
        'ref-md-info',
      )}`,
      (nodes) => nodes.map((n) => n.ariaLabel),
    );
    expect(R.length(metadataIconsAriaLabels)).toEqual(1);
    expect(R.head(metadataIconsAriaLabels)).toContain('S1');
  });

  await test.step('should have metadata icons at every cells at row P3 and column 2021-Q4', async () => {
    const metadataIcons = await page.$$(
      `${testidSelector(
        'ref-md-info',
      )}[aria-label*="P3"][aria-label*="2021-Q4"]`,
    );
    expect(R.length(metadataIcons)).toEqual(5);
  });

  await test.step('should have metadata icons at every cells at column 2022-Q1 only for section S13', async () => {
    const allColumnMetadataIcons = await page.$$(
      `${testidSelector('ref-md-info')}[aria-label*="2022-Q1"]`,
    );
    const columnMetadataIconsAtSection = await page.$$(
      `${testidSelector(
        'ref-md-info',
      )}[aria-label*="2022-Q1"][aria-label*=S13]`,
    );
    expect(R.length(allColumnMetadataIcons)).toEqual(
      R.length(columnMetadataIconsAtSection),
    );
    expect(R.length(columnMetadataIconsAtSection)).toEqual(3);
  });

  await test.step('should have metadata icon at fixed cell S14:P3:2022-Q3', async () => {
    const metadataIcon = await page.$(
      `${testidSelector(
        'ref-md-info',
      )}[aria-label*="S1"][aria-label*="P6"][aria-label*="2022-Q3"]`,
    );
    expect(metadataIcon).not.toBe(null);
  });
});
