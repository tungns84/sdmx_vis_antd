import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
// NOTE: ViewerComp will be replaced with D3.js for charts only, not for tables
import { Viewer as ViewerComp } from '@sis-cc/dotstatsuite-components';
import { rules } from '../../lib/dotstatsuite-antd/rules';
import { isTimePeriodDimension } from '@sis-cc/dotstatsuite-sdmxjs';
import * as R from 'ramda';
import { locales } from '../../lib/settings';
import { getIsPending } from '../../selectors/app.js';
import { getHasMicrodata } from '../../selectors/microdata';
import { getDisplay, getIsRtl } from '../../selectors/router';
import {
  getHeaderSubtitle,
  getHeaderTitle,
  getHeaderCombinations,
  getHeaderProps,
} from '../../selectors/data';
import {
  getDataRequestRange,
  getIsAvailabilityDisabled,
  getRefinedDataRange,
} from '../../selectors/sdmx';
import Guidances from './guidances';
import MetadataIcon from './MetadataIcon';
import Tools from '../vis-tools';
import { FormattedMessage, formatMessage } from '../../i18n';
import SanitizedInnerHTML from '../SanitizedInnerHTML';
import messages from '../messages';
import { ID_VIEWER_COMPONENT } from '../../css-api';
import { getHeaderSideProps } from '../../selectors/metadata';
import { updateMicrodataConstraints } from '../../ducks/microdata';
import { getIsDefaultInformations } from '../../utils/viewer';
import { LEFT, RIGHT } from '../../utils/constants';
import useGetUsedFilters from '../../hooks/useGetUsedFilters';
import useSdmxStructure from '../../hooks/useSdmxStructure';
import useDataTable from '../../hooks/useDataTable';
import ProfiledTable from '../profiled/table';
import useConfig from '../../hooks/chart/useConfig';
import useData from '../../hooks/chart/useData';

const getDisclaimer = (availabilityDisclaimer, sizeDisclaimer) => {
  if (availabilityDisclaimer && sizeDisclaimer) {
    return (
      <span>
        {availabilityDisclaimer}
        <br />
        <br />
        {sizeDisclaimer}
      </span>
    );
  }
  return availabilityDisclaimer || sizeDisclaimer;
};

const getTableSizeDisclaimer = (
  intl,
  range,
  isTruncated,
  totalCells,
  cellsLimit,
) => {
  const { count, total } = range;
  if (count < total || isTruncated) {
    const values = {
      cellsLimit,
      total,
      totalCells,
      type: 'table',
    };
    if (total > cellsLimit) {
      return formatMessage(intl)(messages.visDataLimit, values);
    }
    return formatMessage(intl)(messages.tableCellsLimit, values);
  }
  return null;
};

const getChartSizeDisclaimer = (intl, range, dataLimit) => {
  const { count, total } = range;
  if (count < total) {
    const limit = R.isNil(dataLimit) ? count : dataLimit;
    const values = {
      cellsLimit: limit,
      total,
      type: 'chart',
    };
    return formatMessage(intl)(messages.visDataLimit, values);
  }
  return null;
};

export const TableVisualisation = ({
  isFull,
  maxWidth,
  loading,
  loadingProps,
  noData,
  errorMessage,
  footerProps,
}) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [activeCellCoordinates, setCellCoordinates] = useState({});
  const isRtl = useSelector(getIsRtl);

  //--------------------------------------------------------------------
  const tableContent = useDataTable();
  //--------------------------------------------------------------------

  const display = useSelector(getDisplay);

  const hasMicrodata = useSelector(getHasMicrodata);
  const cellsLimit = useSelector(getDataRequestRange);
  const { observationsType, textAlign } = useSdmxStructure();
  const isAvailabilityDisabled = useSelector(getIsAvailabilityDisabled);
  const range = useSelector(getRefinedDataRange);

  const availabilityDisclaimer = isAvailabilityDisabled
    ? formatMessage(intl)(messages.availabilityDisabled)
    : null;
  const { truncated, totalCells } = tableContent;
  const sizeDisclaimer = getTableSizeDisclaimer(
    intl,
    range,
    truncated,
    totalCells,
    cellsLimit,
  );
  const disclaimer = getDisclaimer(availabilityDisclaimer, sizeDisclaimer);

  const getBooleanValue = (value) => {
    if (value === 'true' || value === '1') {
      return true;
    }
    return false;
  };

  const formatBoolean = (value) =>
    value ? (
      <FormattedMessage id="sdmx.data.true" />
    ) : (
      <FormattedMessage id="sdmx.data.false" />
    );

  const cellValueAccessor = (value) => {
    if (R.is(Object, value))
      return rules.getTableLabelAccessor(display)(value);
    if (R.is(Boolean, value)) return formatBoolean(value);
    else if (observationsType === 'Boolean')
      return formatBoolean(getBooleanValue(value));
    return value;
  };

  const labelAccessor = (item) => {
    if (item.id === 'OBS_ATTRIBUTES') {
      return rules.getTableLabelAccessor(display)({
        id: 'OBS_ATTRIBUTES',
        name: formatMessage(intl)(messages.layoutAttributes),
      });
    }
    if (item.id === 'OBS_VALUE') {
      return rules.getTableLabelAccessor(display)({
        id: 'OBS_VALUE',
        name: formatMessage(intl)(messages.tableObsValue),
      });
    }
    return rules.getTableLabelAccessor(display)(item);
  };

  const selection = useGetUsedFilters();

  const tableProps = {
    ...tableContent,
    SideIcon: MetadataIcon,
    labelAccessor,
    cellValueAccessor,
    activeCellIds: activeCellCoordinates,
    activeCellHandler: setCellCoordinates,
    HTMLRenderer: SanitizedInnerHTML,
    cellHandler: hasMicrodata
      ? ({ indexedDimValIds }) =>
          dispatch(updateMicrodataConstraints(indexedDimValIds, selection))
      : null,
    isNoWrap: isTimePeriodDimension,
    textAlign: R.prop(textAlign)({ RIGHT, LEFT }),
  };

  const _headerProps = useSelector(getHeaderProps);
  const headerSideProps = useSelector(getHeaderSideProps);
  const headerProps = {
    ..._headerProps,
    isSticky: true,
    disclaimer,
    sideProps: headerSideProps,
    SideIcon: MetadataIcon,
  };

  const viewerProps = {
    cellsLimit,
    range,
    isRtl,
    footerProps,
    headerProps,
    tableProps,
    type: 'table',
  };

  return (
    <>
      <Tools maxWidth={maxWidth} isFull={isFull} viewerProps={viewerProps} />
      <div id={ID_VIEWER_COMPONENT}>
        <ProfiledTable
          {...viewerProps}
          errorMessage={errorMessage}
          loading={loading}
          loadingProps={loadingProps}
          noData={noData}
        />
      </div>
      <Guidances type="table" maxWidth={maxWidth} />
    </>
  );
};

export const ChartVisualisation = ({
  type,
  isFull,
  maxWidth,
  loading,
  loadingProps,
  noData,
  errorMessage,
  footerProps,
  locale,
}) => {
  const intl = useIntl();

  const headerTitle = useSelector(getHeaderTitle);
  const headerSubtitle = useSelector(getHeaderSubtitle);
  const headerCombinations = useSelector(getHeaderCombinations);

  const cellsLimit = useSelector(getDataRequestRange);
  const range = useSelector(getRefinedDataRange);
  const isAvailabilityDisabled = useSelector(getIsAvailabilityDisabled);

  const availabilityDisclaimer = isAvailabilityDisabled
    ? formatMessage(intl)(messages.availabilityDisabled)
    : null;
  const sizeDisclaimer = getChartSizeDisclaimer(intl, range, cellsLimit);
  const disclaimer = getDisclaimer(availabilityDisclaimer, sizeDisclaimer);

  const headerSideProps = useSelector(getHeaderSideProps);
  const headerProps = {
    isSticky: true,
    title: headerTitle,
    subtitle: headerSubtitle,
    disclaimer,
    combinations: headerCombinations,
    sideProps: headerSideProps,
    SideIcon: MetadataIcon,
  };

  const {
    chartConfig,
    setChartConfig,
    properties,
    hasNeedOfComputedAxis,
    hasNeedOfResponsiveSize,
    chartOptions,
    focus,
    chartDimension,
    formatterIds,
  } = useConfig();
  const chartData = useData({ focus, chartDimension, formatterIds });
  const isLoadingData = useSelector(getIsPending('getData'));

  const { sourceLabel, title, subtitle, withLogo, withCopyright } = chartConfig;
  const viewerProps = {
    isDefaultTitle: !R.isNil(title) && !R.isEmpty(title),
    isDefaultSubtitle: !R.isNil(subtitle) && !R.isEmpty(subtitle),
    isDefaultSourceLabel: !R.isNil(sourceLabel) && !R.isEmpty(sourceLabel),
    cellsLimit,
    range,
    headerProps: R.pipe(
      R.when(
        R.always(!R.isNil(title) && !R.isEmpty(title)),
        R.assocPath(['title', 'label'], title),
      ),
      R.when(
        R.always(!R.isNil(subtitle) && !R.isEmpty(subtitle)),
        R.assoc('subtitle', [{ label: subtitle }]),
      ),
    )(headerProps),
    footerProps: R.pipe(
      R.when(R.always(!withLogo), R.dissoc('logo')),
      R.when(R.always(!withCopyright), R.dissoc('copyright')),
      R.when(
        R.always(!R.isNil(sourceLabel) && !R.isEmpty(sourceLabel)),
        R.assocPath(['source', 'label'], sourceLabel),
      ),
    )(footerProps),
    chartData,
    chartOptions,
    type,
    ...getIsDefaultInformations(properties),
  };

  return (
    <>
      <Tools
        maxWidth={maxWidth}
        isFull={isFull}
        properties={properties}
        viewerProps={viewerProps}
      />
      <div id={ID_VIEWER_COMPONENT}>
        {/* Check if this is a table view or chart view */}
        {type === 'table' ? (
          // Keep ViewerComp for table display
          <ViewerComp
            {...viewerProps}
            locale={locale}
            timeFormats={{ M: R.path([locale, 'timeFormat'], locales) }}
            errorMessage={errorMessage}
            getAxisOptions={
              hasNeedOfComputedAxis && !isLoadingData ? setChartConfig : null
            }
            getResponsiveSize={
              hasNeedOfResponsiveSize && !isLoadingData ? setChartConfig : null
            }
            loading={loading}
            loadingProps={loadingProps}
            noData={noData}
          />
        ) : (
          // TODO: Replace charts (bar, line, pie, etc.) with D3.js implementation
          <div style={{ padding: '20px', textAlign: 'center', background: '#f0f0f0' }}>
            {type} Chart - Will be replaced with D3.js implementation
          </div>
        )}
      </div>
      <Guidances type={type} maxWidth={maxWidth} />
    </>
  );
};
