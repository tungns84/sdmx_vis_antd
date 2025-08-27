import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import makeStyles from '@mui/styles/makeStyles';
import {
  DeleteAllChip,
  ExpansionPanel,
  Tag,
  GroupedChips,
} from '@sis-cc/dotstatsuite-visions';
import { formatMessage, FormattedMessage } from '../../i18n';
import { resetFilters } from '../../ducks/sdmx';
import { changeFilter } from '../../ducks/vis';
import { PANEL_USED_FILTERS } from '../../utils/constants';
import { getFilter } from '../../selectors';
import { countNumberOf } from '../../utils';
import messages from '../messages';
import useUsedFilters from '../../hooks/useUsedFilters';
import useFilterFrequency from '../../hooks/useFilterFrequency';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import useGetUsedFilters from '../../hooks/useGetUsedFilters';

//--------------------------------------------------------------------------------------------------

export const ClearFilters = ({ onDelete, label }) => {
  return (
    <Grid container>
      <Grid item xs={12} data-testid="clear-filters-test-id">
        <DeleteAllChip onDeleteAll={onDelete} clearAllLabel={label} />
      </Grid>
    </Grid>
  );
};
ClearFilters.propTypes = {
  onDelete: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export const FiltersCurrent = ({ children }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { frequencyFilter = [], periodFilter = [] } = useFilterFrequency();
  const activePanelId = useSelector(getFilter);
  const selection = useGetUsedFilters();
  const counter = countNumberOf(
    R.concat(selection, R.concat(frequencyFilter, periodFilter)),
  );
  return (
    <ExpansionPanel
      isOpen={R.equals(PANEL_USED_FILTERS, activePanelId)}
      onChangeActivePanel={(id) => dispatch(changeFilter(id))}
      id={PANEL_USED_FILTERS}
      label={formatMessage(intl)(messages.title)}
      tag={<Tag>{counter}</Tag>}
    >
      {children}
    </ExpansionPanel>
  );
};
FiltersCurrent.propTypes = {
  children: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[700],
  },
}));

export const UsedFilters = () => {
  const dispatch = useDispatch();
  const selection = useGetUsedFilters();
  const intl = useIntl();
  const classes = useStyles();
  const { items, onDelete, labelRenderer, labels } = useUsedFilters();
  const { specialFiltersItems, onDeleteSpecialFilters } = useFilterFrequency();
  const data = useMemo(
    () => [
      { items, onDelete, labelRenderer },
      { items: specialFiltersItems, onDelete: onDeleteSpecialFilters },
    ],
    [items, specialFiltersItems],
  );
  const mapIndexed = R.addIndex(R.map);
  return (
    <Grid data-testid="used-filters-test-id">
      {R.map((filters) => {
        const { items = [], onDelete, labelRenderer } = filters;
        {
          return mapIndexed((itemProps, idx) => {
            return (
              <Grid key={idx}>
                <GroupedChips
                  ariaLabelTooltip={formatMessage(intl)(messages.chipTooltip)}
                  itemProps={itemProps}
                  onDelete={onDelete}
                  labels={labels}
                  labelRenderer={labelRenderer}
                />
                <Divider className={classes.divider} />
              </Grid>
            );
          })(items);
        }
      })(data)}
      <Grid container>
        <Grid item xs={12}>
          <DeleteAllChip
            onDeleteAll={() => dispatch(resetFilters(selection))}
            clearAllLabel={<FormattedMessage id="vx.filters.current.clear" />}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
