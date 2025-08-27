import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from './utils.js';

test('vis: combinations of values', async ({ servers, page }) => {
  const urlFactory = (display = 'nm') =>
    `/vis?tenant=oecd:de&pg=0&fs[0]=datasourceId%2Cds%3Aqa%3Astable&fc=datasourceId&bp=true&snb=34&vw=tb&df[ds]=hybrid&df[id]=DF_EO_N&df[ag]=OECD.ECO&df[vs]=1.2&pd=%2C&dq=...PT_CONT%2BPT_GDP.A&ly[rw]=MEASURE%2CUNIT_MEASURE%2CCOMBINATION&to[TIME_PERIOD]=false&lo=5&lom=LASTNPERIODS&lb=${display}`;
  // important to 'sync' header and cell
  const invariantSelector = 'tr th:nth-child(3)';
  const testData = [
    {
      label: 'name',
      value: 'nm',
      expectedHeaderText: 'my combination',
      expectedCellText: 'France, Nominal value, 2018',
    },
    {
      label: 'code',
      value: 'id',
      expectedHeaderText: 'COMBINATION',
      expectedCellText: 'FR, N, 2018',
    },
    {
      label: 'both',
      value: 'bt',
      expectedHeaderText: '(COMBINATION) my combination',
      expectedCellText: '(FR, N, 2018) France, Nominal value, 2018',
    },
  ];

  await test.step('load the page', async () => {
    await changeVibe('config')('combinations')(servers);
    await changeVibe('nsi')('oecd')(servers);
  });

  for (const { label, value, expectedHeaderText, expectedCellText } of testData) {
    await test.step(`should with display ${label} (${value}) render '${expectedHeaderText}' and '${expectedCellText}'`, async () => {
      await page.goto(urlFactory(value));

      const headerHandle = await page.waitForSelector(
        `${testidSelector('vis-table')} thead ${invariantSelector}`,
      );
      const headerText = await page.evaluate(
        (el) => el.textContent,
        headerHandle,
      );
      expect(headerText).toEqual(expectedHeaderText);

      const cellHandle = await page.waitForSelector(
        `${testidSelector('vis-table')} tbody ${invariantSelector}`,
      );
      const cellText = await page.evaluate((el) => el.textContent, cellHandle);
      expect(cellText).toEqual(expectedCellText);
    });
  };
});
