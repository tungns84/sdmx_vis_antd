import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { changeStart } from '../../ducks/search';
import { defineMessages, useIntl } from 'react-intl';
import { Pagination as VisionsPagination } from '@sis-cc/dotstatsuite-visions';
import { formatMessage } from '../../i18n';
import { getSearchResultNb, getStart } from '../../selectors/router';

const messages = defineMessages({
  page: { id: 'de.search.page' },
  of: { id: 'de.search.page.of' },
  startPage: { id: 'wcag.search.page.start' },
  previousPage: { id: 'wcag.search.page.previous' },
  nextPage: { id: 'wcag.search.page.next' },
  endPage: { id: 'wcag.search.page.end' },
});

const Pagination = ({ rows }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const searchResultNb = useSelector(getSearchResultNb);
  const start = useSelector(getStart);

  const [pages, page] = useMemo(() => {
    if (R.isNil(rows)) return;
    return [
      parseInt(searchResultNb / rows) + (searchResultNb % rows !== 0 ? 1 : 0),
      start / rows + 1,
    ];
  }, [rows, searchResultNb, start]);

  // labels need to be string to support wcag
  const labels = useMemo(() => {
    return R.reduce(
      (memo, [id, message]) => R.assoc(id, formatMessage(intl)(message), memo),
      {},
      R.toPairs(messages),
    );
  }, [messages, intl]);

  const handleChangeStart = (...args) => dispatch(changeStart(...args));

  const isBlank = R.isNil(rows) || R.isNil(pages) || pages === 1;
  if (isBlank) return null;

  return (
    <VisionsPagination
      page={page}
      pages={pages}
      onChange={(page) => handleChangeStart(rows * (page - 1))}
      onSubmit={(page) => handleChangeStart(rows * (page - 1))}
      labels={labels}
    />
  );
};

Pagination.propTypes = {
  rows: PropTypes.number,
};

export default Pagination;
