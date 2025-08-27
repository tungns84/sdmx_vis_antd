import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import dateFns from 'date-fns';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeDataquery,
  changeFrequencyPeriod,
  changeFrequencyPeriodDataquery,
  changeLastNObservations,
  changeLastNObservationsDataquery,
} from '../../ducks/sdmx';
import { changeFilter } from '../../ducks/vis';
import { formatMessage } from '../../i18n';
import { getVisDimensionFormat } from '../../selectors';
import {
  getDataquery,
  getHasAccessibility,
  getHasDataAvailability,
  getLastNMode,
  getLastNObservations,
} from '../../selectors/router';
import {
  getAvailableFrequencies,
  getDatesBoundaries,
  getDimensions,
  getFilters,
  getFrequency,
  getFrequencyArtefact,
  getPeriod,
  getTimePeriodArtefact,
} from '../../selectors/sdmx';
import { getFilterLabel } from '../../utils';
import messages from '../messages';
import SanitizedInnerHTML from '../SanitizedInnerHTML';
import { tagAccessor } from './utils';
import useSdmxAC from '../../hooks/sdmx/useSdmxAC';
import useSdmxStructure from '../../hooks/useSdmxStructure';
import { displayChildren } from '../../lib/settings';
import { DynamicDrawer, Tag } from '@sis-cc/dotstatsuite-visions';
import { getIntervalPeriod } from '../../lib/sdmx/frequency';
import { LASTNOBSERVATIONS, LASTNPERIODS } from '../../utils/used-filter';
import Period from './period';
import LastNPeriod from './lastn-period';
import { MARGE_RATIO, PANEL_PERIOD } from '../../utils/constants';
import { updateDataquery } from '@sis-cc/dotstatsuite-sdmxjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import useMaxWidth from '../../hooks/useMaxWidth';
import { getVisPageWidth } from '../../selectors/app.js';

const Filters = ({ classes }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [dataquery, setDataquery] = useState(null);
  const frequency = useSelector(getFrequency);
  const period = useSelector(getPeriod);
  const [newPeriod, setNewPeriod] = useState(null);
  const [newFrequency, setNewFrequency] = useState(null);
  const hasDataAvailability = useSelector(getHasDataAvailability);
  const { availableConstraints, refetch } = useSdmxAC(dataquery);
  const { automatedSelections } = useSdmxStructure();
  const isNarrow = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const datesBoundaries = useSelector(getDatesBoundaries);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const lastN = useSelector(getLastNObservations);
  const lastNMode = useSelector(getLastNMode);
  const maxWidthVis = useSelector(getVisPageWidth);
  const [newlastN, setnewLastN] = useState(lastN);
  const [newlastNMode, setNewLastNMode] = useState(lastNMode);

  useEffect(() => {
    setNewPeriod(period);
  }, [period]);
  useEffect(() => {
    setnewLastN(lastN);
  }, [lastN]);
  useEffect(() => {
    setNewLastNMode(newlastNMode);
  }, [newlastNMode]);

  const style = useMaxWidth({
    visWidth: maxWidthVis
      ? maxWidthVis - maxWidthVis * (1 - MARGE_RATIO)
      : '100%',
    isFull: false,
  });

  const makeTagAriaLabel = (count, total) =>
    formatMessage(intl)(messages.tagLabel, { count, total });

  const periodLabel =
    timePeriodArtefact?.label || formatMessage(intl)(messages.last);
  const frequencyLabel =
    frequencyArtefact?.label || formatMessage(intl)(messages.head);

  const noFrequency = R.or(
    R.isEmpty(availableFrequencies),
    R.pipe(R.keys, R.length, R.equals(1))(availableFrequencies),
  );
  const labelTP = noFrequency
    ? periodLabel
    : R.join(' & ')([frequencyLabel, periodLabel]);
  const tagValueLabel =
    R.not(R.isNil(datesBoundaries)) &&
    R.pipe(getIntervalPeriod(datesBoundaries), ([count, total]) =>
      makeTagAriaLabel(count, total),
    )(frequency, period);
  const tag = R.not(R.isNil(datesBoundaries)) && (
    <Tag tagValueLabel={tagValueLabel}>
      {R.pipe(getIntervalPeriod(datesBoundaries), ([count, total]) => {
        const lastNCount = R.equals(lastNMode, LASTNPERIODS)
          ? lastN
          : `${lastN}+`;
        return lastN
          ? tagAccessor(lastNCount, total)
          : tagAccessor(count, total);
      })(frequency, period)}
    </Tag>
  );

  const filters = useSelector((state) =>
    getFilters(state, { availableConstraints, automatedSelections }),
  );
  const noTP =
    R.isNil(datesBoundaries) ||
    R.isNil(timePeriodArtefact) ||
    !timePeriodArtefact?.display;
  const allFilters = noTP
    ? filters
    : R.prepend(
        {
          id: PANEL_PERIOD,
          label: labelTP,
          tag,
          values: [],
        },
        filters,
      );

  const accessibility = useSelector(getHasAccessibility);
  const labelAccessor = useSelector(getVisDimensionFormat());
  const dimensions = useSelector(getDimensions);
  const routerDataQuery = useSelector(getDataquery);
  const changeSelection = (...args) => dispatch(changeDataquery(...args));
  const onChangeActivePanel = (...args) => dispatch(changeFilter(...args));

  const handleChangePanel = (newId, selection, allSelection) => {
    onChangeActivePanel(newId);
    if (
      R.isEmpty(selection) ||
      R.equals(R.values(selection), allSelection[newId])
    )
      return;

    const newdq = updateDataquery(dimensions, routerDataQuery, {
      ...allSelection,
    });
    setDataquery(newdq);
    refetch();
  };
  const applyPeriod = (period) =>
    dispatch(changeFrequencyPeriod({ valueId: frequency, period }));
  const applyFrequency = (frequency) => {
    dispatch(
      changeFrequencyPeriod({
        valueId: frequency,
        period: [
          dateFns.startOfYear(R.head(period)),
          dateFns.endOfYear(R.last(period)),
        ],
      }),
    );
  };

  const changePeriod = (period) => {
    setNewPeriod(period);
    if (R.equals(newlastNMode, LASTNPERIODS)) {
      setnewLastN('');
      setNewLastNMode(undefined);
    }
  };

  const handleChangeMode = (mode) => {
    if (R.equals(mode, LASTNPERIODS)) {
      setNewPeriod([undefined, undefined]);
    }
    setNewLastNMode(mode);
  };
  const handleChangeValue = (val) => {
    setnewLastN(val);
    if (!R.equals(newlastNMode, LASTNOBSERVATIONS)) {
      setNewLastNMode(LASTNPERIODS);
      setNewPeriod([undefined, undefined]);
    }
  };
  const handleApply = (selection) => {
    const noPeriod = (p) => R.equals(p, [undefined, undefined]) || R.isNil(p);

    if (R.isEmpty(selection)) {
      if (noTP) return;
      if (
        R.isNil(newFrequency) &&
        R.isNil(newPeriod) &&
        R.equals(newlastN, lastN) &&
        R.equals(newlastNMode, lastNMode)
      )
        return;
      if (!R.equals(newlastNMode, lastNMode) || !R.equals(newlastN, lastN)) {
        if (!R.isNil(newFrequency)) {
          applyFrequency(newFrequency);
        }
        if (
          !R.isNil(newPeriod) &&
          R.isNil(newlastNMode) &&
          R.isEmpty(newlastN)
        ) {
          applyPeriod(newPeriod);
          return;
        }
        if (R.equals(newlastN, lastN)) {
          dispatch(changeLastNObservations(lastN, newlastNMode));
        }
        if (R.equals(newlastNMode, lastNMode)) {
          dispatch(changeLastNObservations(newlastN, lastNMode));
        }
        if (!R.equals(newlastNMode, lastNMode) && !R.equals(newlastN, lastN)) {
          dispatch(changeLastNObservations(newlastN, newlastNMode));
        }
        return;
      }

      if (R.isNil(newPeriod)) {
        return applyFrequency(newFrequency);
      }
      if (R.isNil(newFrequency)) {
        return applyPeriod(newPeriod);
      }
      if (!R.isNil(newPeriod) && !R.isNil(newFrequency)) {
        return dispatch(
          changeFrequencyPeriod({ valueId: newFrequency, period: newPeriod }),
        );
      }
    }

    if (
      !noTP &&
      noPeriod(newPeriod) &&
      (!R.equals(newlastNMode, LASTNPERIODS) || !R.equals(newlastN, lastN))
    ) {
      return dispatch(
        changeLastNObservationsDataquery(newlastN, newlastNMode, selection),
      );
    }
    if (
      noTP ||
      (noPeriod(newPeriod) && R.isNil(newFrequency)) ||
      (R.equals(newFrequency, frequency) && R.isNil(newPeriod))
    ) {
      return changeSelection(selection);
    }
    dispatch(
      changeFrequencyPeriodDataquery({
        valueId: R.isNil(newFrequency) ? frequency : newFrequency,
        period: R.isNil(newPeriod) ? period : newPeriod,
        dataquery: selection,
      }),
    );
  };

  const handleClosePanel = () => {
    setDataquery(null);
    // setnewLastN(null);
    // setNewLastNMode(null);
    setNewFrequency(null);
    setNewPeriod(null);
  };

  const labels = {
    disableItemLabel: formatMessage(intl)(messages.disableItemLabel),
    placeholder: (total) => formatMessage(intl)(messages.primary, { total }),
    iconLabel: formatMessage(intl)(messages.advancedFilter),
    navigateNext: formatMessage(intl)(messages.next),
    singleSelection: formatMessage(intl)(messages.singleSelection),
    childrenSelection: formatMessage(intl)(messages.childrenSelection),
    branchSelection: formatMessage(intl)(messages.branchSelection),
    levelSelection: formatMessage(intl)(messages.levelSelection),
    selectAll: formatMessage(intl)(messages.selectAll),
    deselectAll: formatMessage(intl)(messages.deselectAll),
    apply: formatMessage(intl)(messages.applyFilter),
    cancel: formatMessage(intl)(messages.closeFilter),
    expandAll: formatMessage(intl)(messages.expandAll),
    colapseAll: formatMessage(intl)(messages.colapseAll),
    selectionMode: formatMessage(intl)(messages.filterSelectionMode),
    hint: formatMessage(intl)(messages.filterSelectionHint),
    title: (dimension) =>
      formatMessage(intl)(messages.filterTitle, { dimension }),
  };

  return (
    <DynamicDrawer
      list={allFilters || []}
      labelRenderer={getFilterLabel(labelAccessor)}
      onClick={handleApply}
      isNarrow={isNarrow}
      labels={labels}
      styles={{ width: isNarrow ? null : style.maxWidth }}
      classes={classes}
      disableAccessor={R.pipe(R.prop('isEnabled'), R.not)}
      expandAll={false}
      collapseAll={false}
      spotlight={null}
      setSpotlight={() => {}}
      expandedIds={null}
      allItems={filters}
      periodPanel={PANEL_PERIOD}
      HTMLRenderer={SanitizedInnerHTML}
      onChangeActivePanel={onChangeActivePanel}
      testId="filter"
      displayChildren={displayChildren}
      accessibility={accessibility}
      tagAccessor={tagAccessor}
      tagAriaLabel={(count, total) =>
        formatMessage(intl)(messages.tagLabel, { count, total })
      }
      onClosePanel={handleClosePanel}
      handleChangePanel={handleChangePanel}
      hasDataAvailability={hasDataAvailability}
      isApplyHiddenNarrow={R.all(R.isNil, [
        newFrequency,
        newPeriod,
        newlastN,
        newlastNMode,
      ])}
    >
      {!noTP && (
        <div>
          <Period
            period={R.isNil(newPeriod) ? period : newPeriod}
            changePeriod={changePeriod}
            frequency={R.isNil(newFrequency) ? frequency : newFrequency}
            changeFrequency={setNewFrequency}
          />
          <LastNPeriod
            handleChange={handleChangeMode}
            value={newlastN}
            lastNMode={R.isNil(newlastNMode) ? lastNMode : newlastNMode}
            handleChangeValue={handleChangeValue}
          />
        </div>
      )}
    </DynamicDrawer>
  );
};

Filters.propTypes = {
  isNarrow: PropTypes.bool,
};

export default Filters;
