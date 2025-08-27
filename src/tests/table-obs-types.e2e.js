import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, testidSelector, dimHeaderSelector } from './utils.js';

test('table display of differents observations types', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('types')(servers);
    
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DF_TEST_GREGORIANDAY&df[ag]=OECD&df[vs]=1.0&vw=tb`;
    await page.goto(url);
  });
  await test.step('load the viz page and wait for the table to be displayed', async () => {
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('test boolean values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'BOOLEAN'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      'Yes',
      'No',
      '1',
      '0',
      'true',
      'false',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('test string values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'STRING'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      'string content',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('test month values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'MONTH'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      '01',
      '10',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('test month-day values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'MON-DAY'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      '01-31',
      '10-13',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('test day values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'DAY'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      '28',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('test formatted number values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'NUMBER'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      '654,958,468.6544899',
      '654,958,469',
      '654,958,468.7',
      '654,958,468.65',
      '654,958,468.654',
      '6,549,584.6865449',
      '6,549,585',
      '6,549,584.7',
      '6,549,584.69',
      '6,549,584.687',
      '654,958,468,654.4899',
      '654,958,468,654',
      '654,958,468,654.5',
      '654,958,468,654.49',
      '654,958,468,654.490',
    ]);
  });
  await test.step('test html render', async () => {
    const htmlText = await page.$eval(
      '[headers*="DATATYPE=HTML"] > span > p > b',
      (node) => node.textContent,
    );
    expect(htmlText).toEqual('Bold');
  });
  await test.step("click on locale 'Français'", async () => {
    await page.click('#languages');
    await page.click('li#fr');
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('re test boolean values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'BOOLEAN'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      'Oui',
      'Non',
      '1',
      '0',
      'true',
      'false',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
  await test.step('re test formatted number values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'NUMBER'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      '654 958 468,6544899',
      '654 958 469',
      '654 958 468,7',
      '654 958 468,65',
      '654 958 468,654',
      '6 549 584,6865449',
      '6 549 585',
      '6 549 584,7',
      '6 549 584,69',
      '6 549 584,687',
      '654 958 468 654,4899',
      '654 958 468 654',
      '654 958 468 654,5',
      '654 958 468 654,49',
      '654 958 468 654,490',
    ]);
  });
  await test.step('switch to fixed boolen type', async () => {
    await changeVibe('nsi')('types:boolean')(servers);
    await page.reload();
    await page.waitForSelector(testidSelector('vis-table'));
  });
  await test.step('test boolean values', async () => {
    const cells = await page.$$eval(
      dimHeaderSelector('DATATYPE', 'BOOLEAN'),
      (cells) => cells.map((cell) => cell.textContent),
    );
    expect(cells).toEqual([
      'Oui',
      'Non',
      'Oui',
      'Non',
      'Oui',
      'Non',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
    ]);
  });
});
