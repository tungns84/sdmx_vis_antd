import { expect, test } from '../../../.playwright/farso-fixture';
import { changeVibe, waitForResponse } from './utils';

test('no content constraints', async ({ servers, page }) => {
  let dataUrl = null;
  await test.step('load the viz page and wait for data request', async () => {
    await changeVibe('config')('main')(servers);
    await changeVibe('nsi')('crs1')(servers);
    const url = `/vis?tenant=oecd:de&lc=en&df[ds]=hybrid&df[id]=DSD_CRS%40DF_CRS1&df[ag]=OECD.DCD&df[vs]=9.0`;
    const response = await waitForResponse(
      page,
      expect,
      '/data/',
      () => page.goto(url),
      () => true,
      () => true,
      false,
    );
    dataUrl = response.url();
  });

  await test.step('should have requested default selection, frequency and last 5 periods', async () => {
    expect(dataUrl).toContain('AUS........A');
    expect(dataUrl).toContain('startPeriod=2016');
    expect(dataUrl).not.toContain('endPeriod');
  });
});
