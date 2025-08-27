import axios from 'axios';
import * as R from 'ramda';

export const testidSelector = (testid) => `[data-testid="${testid}"]`;
export const changeVibe = (srv) => (vibe) => (FARSO_SERVERS) =>
  axios.get(`${FARSO_SERVERS[srv].url}/_vibes_/${vibe}`);

export const itShouldFindNbResults = async ({ page, expect, nb }) => {
  await page.waitForSelector(testidSelector('search_results'));
  const nbOfResults = await page.$$eval(
    `${testidSelector('search_results')} > div`,
    (e) => e.length,
  );
  expect(nbOfResults).toEqual(nb);
};

export const itShouldFindNbCells = async ({ page, expect, nb }) => {
  await page.waitForSelector(testidSelector('vis-table'));
  const nbOfResults = await page.$$eval(
    `${testidSelector('vis-table')} td`,
    (e) => e.length,
  );
  expect(nbOfResults).toEqual(nb);
};

export const dimHeaderSelector = (dimension, value) =>
  `[headers*="${dimension}=${value}"]`;

export const getTableLayout = async (page) => {
  const table = await page.$(testidSelector('vis-table'));
  const rows = await table.$$eval(testidSelector('row-dim'), (nodes) =>
    nodes.map((n) => n.ariaLabel),
  );
  const sections = await table.$$eval(testidSelector('section-dim'), (nodes) =>
    nodes.map((n) => n.ariaLabel),
  );
  const header = await table.$$eval(testidSelector('header-dim'), (nodes) =>
    nodes.map((n) => n.ariaLabel),
  );
  return { header, rows, sections: R.uniq(sections) };
};

export const getCustomizeLayout = async (page) => {
  const dropColumns = await page.$(testidSelector('droppable-header'));
  const dropSections = await page.$(testidSelector('droppable-sections'));
  const dropRows = await page.$(testidSelector('droppable-rows'));

  const header = await dropColumns.$$eval(
    '[data-testid*="draggable"]',
    (nodes) => nodes.map((n) => n.ariaLabel),
  );
  const sections = await dropSections.$$eval(
    '[data-testid*="draggable"]',
    (nodes) => nodes.map((n) => n.ariaLabel),
  );
  const rows = await dropRows.$$eval('[data-testid*="draggable"]', (nodes) =>
    nodes.map((n) => n.ariaLabel),
  );

  return { header, sections, rows };
};

export const waitForTransition = async (page, selector) =>
  await page.$eval(selector, (el) => async (done) => {
    const onEnd = () => {
      el.removeEventListener('transitionend', onEnd);
      done();
    };
    el.addEventListener('transitionend', onEnd);
  });

export const waitForResponse = async (
  page,
  expect,
  pattern,
  trigger,
  headerValidator = R.T,
  paramsValidator = R.T,
  validateResponse = true,
) => {
  const [response] = await Promise.all([
    page.waitForResponse((res) => {
      const url = res.url();
      const headers = res.request().headers();
      return (
        url.includes(pattern) &&
        headerValidator(headers) &&
        paramsValidator(new URL(url).searchParams)
      );
    }),
    trigger(),
  ]);

  if (validateResponse) expect(response.status()).toBe(200);
  return response;
};
