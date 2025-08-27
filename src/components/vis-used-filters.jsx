import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { countNumberOf } from '../utils';
import useFilterFrequency from '../hooks/useFilterFrequency';
import useGetUsedFilters from '../hooks/useGetUsedFilters';
import { getVisPageWidth } from '../selectors/app.js';
import useUsedFilters from '../hooks/useUsedFilters';
import { getIsMicrodata } from '../selectors/microdata';
import { getIsFull } from '../selectors';
import UsedFilters from './UsedFilters';
import { getRefinedDataRange } from '../selectors/sdmx';
import { FormattedMessage } from '../i18n';

const VisUserFilters = () => {
  const {
    frequencyFilter = [],
    periodFilter = [],
    onDeleteSpecialFilters,
    specialFiltersItems,
  } = useFilterFrequency();
  const selection = useGetUsedFilters();
  const isFull = useSelector(getIsFull());
  const range = useSelector(getRefinedDataRange);
  const isMicrodata = useSelector(getIsMicrodata);
  const visPageWidth = useSelector(getVisPageWidth);
  const { items, onDelete, labelRenderer, labels, onDeleteAll, clearAllLabel } =
    useUsedFilters();

  const counter = countNumberOf(
    R.concat(selection, R.concat(frequencyFilter, periodFilter)),
  );

  if (isFull || isMicrodata || counter === 0) return null;

  const data = [
    { items, labelRenderer, onDelete },
    {
      items: specialFiltersItems,
      labelRenderer: R.prop('label'),
      onDelete: onDeleteSpecialFilters,
    },
  ];

  const obsCount = R.propOr(0, 'total', range);
  const VIS_DATA_POINTS_ID = 'datapoints';

  return (
    <UsedFilters
      counter={counter}
      maxWidth={visPageWidth}
      data={data}
      labels={labels}
      clearAllLabel={clearAllLabel}
      onDeleteAll={onDeleteAll}
      dataCount={obsCount === 0 ? null : obsCount}
      dataCountLabel={
        <FormattedMessage id="de.vis.data.points" values={{ obsCount }} />
      }
      dataCountId={VIS_DATA_POINTS_ID}
    />
  );
};

export default VisUserFilters;
