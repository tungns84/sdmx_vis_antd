import { expect, test } from '../../../../.playwright/farso-fixture';
import { changeVibe, testidSelector } from '../utils';

test('search single result to viz page', async ({ servers, page }) => {
  await test.step('load the page', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('sfs')('oecd')(servers);
    await page.goto(`?tenant=oecd:de`);
  });

  await test.step('should find datasources facet in home page', async () => {
    await page.waitForSelector('[id=id_home_page]');
    const facet = await page.$(testidSelector('collapseButton_datasourceId'));
    expect(facet).not.toEqual(null);
  });

  await test.step('open datasources facet and select ds-demo-reset', async () => {
    await changeVibe('nsi')('oecd')(servers);
    const facet = await page.$(testidSelector('collapseButton_datasourceId'));
    await facet.click();
    await page.waitForSelector(
      `${testidSelector('collapseButton')} > div:nth-child(5)`,
    );
    await page.waitForSelector('[aria-label=ds-demo-reset]');
    const facetValue = await page.$('[aria-label=ds-demo-reset]');
    await facetValue.click();
  });

  await test.step('should open directly visPage', async () => {
    await page.waitForSelector('#id_viewer_component');
  });

  await test.step('should find go back to search link', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    expect(link).not.toEqual(null);
  });

  await test.step('clicking the link should go back to home page', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
    await page.waitForSelector('[id=id_home_page]');
  });

  await test.step('open a viz page without search params in url', async () => {
    await changeVibe('nsi')('ddown');
    const nextUrl = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_DEBT_TRANS_DDOWN@DF_DDOWN&df[ag]=OECD.DAF&df[vs]=1.0&vw=tb`;
    await page.goto(nextUrl);
  });

  await test.step('should find go back to search link', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    expect(link).not.toEqual(null);
  });

  await test.step('clicking the link should go back to home page', async () => {
    const link = await page.$(testidSelector('back-search-link'));
    await link.click();
    await page.waitForSelector('[id=id_home_page]');
  });
});
