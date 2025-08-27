import React from 'react';
import PropTypes from 'prop-types';
import { ExpansionPanel } from '@sis-cc/dotstatsuite-visions';
import { useIntl } from 'react-intl';
import { PANEL_NARROW_FILTER } from '../../utils/constants';
import { formatMessage } from '../../i18n';

const messages = {
  label: { id: 'de.side.filters.action' },
  searchFiltersLabel: { id: 'de.side.filters.result' },
};

const NarrowFilters = ({
  isNarrow,
  isPopper,
  popperLabels,
  children,
  isSearch,
}) => {
  const intl = useIntl();
  if (isNarrow) {
    return (
      <ExpansionPanel
        key={PANEL_NARROW_FILTER}
        id={PANEL_NARROW_FILTER}
        label={
          isSearch
            ? formatMessage(intl)(messages.searchFiltersLabel)
            : formatMessage(intl)(messages.label)
        }
        overflow
        moreFilters
        isNarrow
        isPopper={isPopper}
        popperLabels={popperLabels}
      >
        {children}
      </ExpansionPanel>
    );
  }
  return children;
};

NarrowFilters.propTypes = {
  isNarrow: PropTypes.bool,
  isPopper: PropTypes.bool,
  popperLabels: PropTypes.object,
  children: PropTypes.node,
};

export default NarrowFilters;
