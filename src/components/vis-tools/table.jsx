import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { rules } from '../../lib/dotstatsuite-antd/rules';
// Layout configuration removed - use toolbar Layout button instead
import { useIntl } from 'react-intl';
import { FormattedMessage, formatMessage } from '../../i18n';
import { changeLayout, changeTimeDimensionOrders } from '../../ducks/vis';
import { getVisDimensionFormat } from '../../selectors';
import { getTimePeriodArtefact } from '../../selectors/sdmx';
import {
  getHasAccessibility,
  getTableLayout as getRouterLayoutIds,
  getTimeDimensionOrders,
} from '../../selectors/router';
import messages from '../messages';
import {
  cleanLayoutIds,
  getTableConfigLayout,
  getLayoutCombinations,
  refineWithCurrent,
} from '../../lib/layout';
import { getObsAttributes } from '../../selectors/data';
import useDataTable from '../../hooks/useDataTable';

const Table = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const _changeLayoutHandler = (...args) => dispatch(changeLayout(...args));
  const changeTimeDimensionOrdersHandler = (...args) =>
    dispatch(changeTimeDimensionOrders(...args));

  const accessibility = useSelector(getHasAccessibility);
  const itemRenderer = useSelector(getVisDimensionFormat());
  const itemButton = useSelector(getTimeDimensionOrders);
  const timePeriod = useSelector(getTimePeriodArtefact);
  const obsAttributes = useSelector(getObsAttributes);
  const routerLayoutIds = useSelector(getRouterLayoutIds);
  const { layout, combinations } = useDataTable();
  const configLayout = getTableConfigLayout(layout);
  const _combinations = getLayoutCombinations(combinations);
  const changeLayoutHandler = (layout) => {
    const next = R.pipe(
      (l) => rules.injectCombinationsInLayout(_combinations, l),
      (l) => refineWithCurrent(routerLayoutIds, l, _combinations),
      (l) => cleanLayoutIds(_combinations, l),
    )(layout);
    _changeLayoutHandler(next);
  };

  const asc = formatMessage(intl)(messages.asc);
  const desc = formatMessage(intl)(messages.desc);
  const timePeriodId = R.propOr('', 'id')(timePeriod);
  const isTimeDimensionInverted = R.propOr(false, timePeriodId)(itemButton);
  const timePeriodButton = {
    ...timePeriod,
    value: isTimeDimensionInverted ? desc : asc,
    options: [asc, desc],
    onChange: (v) =>
      changeTimeDimensionOrdersHandler(timePeriodId, R.equals(desc)(v)),
  };

  return (
    <div>
      {/* TableLayoutConfig removed - use toolbar Layout button instead */}
      <p>Layout configuration has been moved to the toolbar.</p>
      <p>Click the "Layout" button in the toolbar to configure the table layout.</p>
    </div>
  );
};

export default Table;
