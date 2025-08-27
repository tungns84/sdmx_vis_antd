import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { AdvancedFilterDialog } from '@sis-cc/dotstatsuite-visions';
import * as R from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { formatMessage } from '../../i18n';
import { getVisDimensionFormat } from '../../selectors';
import {
  getHasAccessibility,
  getHasDataAvailability,
} from '../../selectors/router';
import { getFilterLabel } from '../../utils';
import messages from '../messages';
import SanitizedInnerHTML from '../SanitizedInnerHTML';
import { displayChildren } from '../../lib/settings';

const AdvancedPopup = (props) => {
  const intl = useIntl();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));
  const accessibility = useSelector(getHasAccessibility);
  const labelAccessor = useSelector(getVisDimensionFormat());
  const hasDataAvailability = useSelector(getHasDataAvailability);

  const labels = {
    disableItemLabel: formatMessage(intl)(messages.disableItemLabel),
    placeholder: (total) => formatMessage(intl)(messages.primary, { total }),
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
  };

  return (
    <AdvancedFilterDialog
      {...props}
      isNarrow={isNarrow}
      disableAccessor={R.pipe(R.prop('isEnabled'), R.not)}
      displayAccessor={hasDataAvailability ? R.prop('hasData') : undefined}
      labelRenderer={getFilterLabel(labelAccessor)}
      accessibility={accessibility}
      labels={labels}
      HTMLRenderer={SanitizedInnerHTML}
      displayChildren={displayChildren}
    />
  );
};

export default AdvancedPopup;
