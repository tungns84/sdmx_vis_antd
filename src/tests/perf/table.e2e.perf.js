import * as R from 'ramda';
import { ID_VIEWER_COMPONENT } from '../../css-api';
import { changeVibe, testidSelector } from '../utils';

describe('perf > table > OECD.GOV/DF_GOV_8_9/2.0 > 3262 obs', () => {
  let page;
  const repeat = 3;
  const threshold = 1900;
  const urlFactory = (layout) =>
    `/vis?tenant=oecd:de&fs[0]=Topic%2C0%7CGovernment%23GOV%23&pg=0&fc=Topic&bp=true&snb=3&vw=tb&df[ds]=hybrid&df[id]=DF_GOV_8_9&df[ag]=OECD.GOV&df[vs]=2.0&pd=%2C&dq=A.......&${layout}&to[TIME_PERIOD]=false&lo=5&lom=LASTNPERIODS`;

  const layouts = [
    {
      label: '3000 / 29410 cells, layout 8 rows',
      threshold,
      layout:
        'ly[rw]=REF_AREA%2CCATEGORY%2CTIME_PERIOD%2CMEASURE%2CSEX%2CAGE%2CEDUCATION_LEV%2CUNIT_MEASURE',
    },
    {
      label: '3000 / 93014 cells, layout 3 columns, 5 rows',
      threshold,
      layout:
        'ly[cl]=CATEGORY%2CREF_AREA%2CMEASURE&ly[rw]=TIME_PERIOD%2CSEX%2CAGE%2CEDUCATION_LEV%2CUNIT_MEASURE',
    },
    {
      label: '3000 / 22850 cells, layout 3 sections, 5 rows',
      threshold,
      layout:
        'ly[rs]=REF_AREA%2CCATEGORY%2CTIME_PERIOD&ly[rw]=MEASURE%2CSEX%2CEDUCATION_LEV%2CAGE%2CUNIT_MEASURE',
    },
    {
      label: '3000 / 48917 cells, layout 3 columns, 3 sections, 2 rows',
      threshold,
      layout:
        'ly[cl]=MEASURE%2CSEX%2CEDUCATION_LEV&ly[rs]=REF_AREA%2CCATEGORY%2CTIME_PERIOD&ly[rw]=AGE%2CUNIT_MEASURE',
    },
  ];

  beforeAll(async (done) => {
    await changeVibe('nsi')('perf');
    page = await global.__BROWSER__.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    done();
  });

  R.forEach(({ label, threshold, layout }) => {
    R.times((n) => {
      it(`test#${R.inc(
        n,
      )} > lte than ${threshold}ms > ${label}`, async (done) => {
        const url = global._E2E_.makeUrl(urlFactory(layout));
        await page.goto(url);
        await page.waitForSelector(testidSelector('vis-table'));
        const measuredPerf = await page.evaluate(
          `${ID_VIEWER_COMPONENT}_profiler`,
        );
        expect(measuredPerf).toBeLessThanOrEqual(threshold);
        done();
      });
    }, repeat);
  }, layouts);
});
