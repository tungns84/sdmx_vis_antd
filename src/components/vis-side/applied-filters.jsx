import React from 'react';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import { GroupedChips } from '@sis-cc/dotstatsuite-visions';
import { isLast } from '../vis/overview/utils';
import messages from '../messages';
import { formatMessage } from '../../i18n';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[700],
  },
}));

const AppliedFilters = React.forwardRef(({ data, labels }, ref) => {
  const classes = useStyles();
  const intl = useIntl();
  const mapIndexed = R.addIndex(R.map);

  return (
    <Grid data-testid="usedFilters-vis-test-id" ref={ref}>
      <Grid container>
        {mapIndexed((filters, index) => {
          const { items, onDelete, labelRenderer } = filters;
          return mapIndexed((itemProps, idx) => {
            return (
              <Grid item key={idx}>
                <Grid container>
                  <GroupedChips
                    itemProps={itemProps}
                    onDelete={onDelete}
                    labelRenderer={labelRenderer}
                    labels={labels}
                    ariaLabelTooltip={formatMessage(intl)(messages.chipTooltip)}
                  />
                  {(!isLast(idx, items) || !isLast(index, data)) && (
                    <Divider
                      orientation="vertical"
                      className={classes.divider}
                      flexItem
                    />
                  )}
                </Grid>
              </Grid>
            );
          })(items);
        })(data)}
      </Grid>
    </Grid>
  );
});
AppliedFilters.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.object.isRequired,
};

export default AppliedFilters;
