import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { getData, getDataquery } from '../selectors/microdata';
import { getCustomAttributes } from '../selectors';
import { getHCodes } from '../selectors/sdmx';
import {
  prepareTableColumns,
  prepareTableRows,
  getMissingRows,
} from '../lib/sdmx/microdata';
import useSdmxStructure from './useSdmxStructure';

export default () => {
  const data = useSelector(getData);
  const hierarchies = useSelector(getHCodes);
  const customAttributes = useSelector(getCustomAttributes);
  const dataquery = useSelector(getDataquery);

  const { automatedSelections } = useSdmxStructure();
  const columns = useMemo(() => {
    if (R.isNil(data)) {
      return [];
    }
    return prepareTableColumns(data, customAttributes);
  }, [data]);
  const rows = useMemo(() => {
    if (R.isNil(data)) {
      return [];
    }
    return R.pipe(
      prepareTableRows,
      R.reduce((acc, row) => {
        const missingRows = getMissingRows(row, R.last(acc), columns);
        return R.concat(acc, missingRows);
      }, []),
    )(data, hierarchies, automatedSelections, dataquery);
  }, [data, hierarchies, automatedSelections, dataquery]);
  const count = useMemo(
    () =>
      R.pipe(
        R.pathOr({}, ['dataSets', 0, 'observations']),
        R.values,
        R.length,
      )(data),
    [data],
  );

  return { rows, columns, count };
};
