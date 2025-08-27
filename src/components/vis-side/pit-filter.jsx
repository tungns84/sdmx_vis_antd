import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { FormattedMessage, formatMessage } from '../../i18n';
import {
  getActualContentConstraints,
  getActuallContentConstraintId,
} from '../../selectors/sdmx';
import { changeConstraintId } from '../../ducks/sdmx';
import useUserRights from '../../hooks/useUserRights';
import { getDataflow } from '../../selectors/router';
import { getReadPITPermissionInScope } from '../../lib/permissions';
import messages from '../messages';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '12px 16px',
    marginTop: 5,
    boxShadow: 'none',
  },
  label: {
    textTransform: 'none',
    color: theme.palette.grey[700],
    ...R.pathOr({}, ['mixins', 'expansionPanel', 'title'], theme),
  },
}));

const PiTFilter = () => {
  const dispatch = useDispatch();
  const dataflow = useSelector(getDataflow);
  const constraints = useSelector(getActualContentConstraints);
  const constraintId = useSelector(getActuallContentConstraintId);
  const { rights } = useUserRights();
  const classes = useStyles();
  const intl = useIntl();

  const readPITPermission = getReadPITPermissionInScope(rights, dataflow);
  if (R.length(constraints) < 2 || R.isNil(readPITPermission)) {
    return null;
  }

  return (
    <Paper id="pit-filter" className={classes.paper}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <Typography
          noWrap
          variant="body2"
          title={formatMessage(messages.pitFilterTitle)}
          className={classes.label}
        >
          <FormattedMessage {...messages.pitFilterTitle} />
        </Typography>
      </Box>
      <FormControl>
        <RadioGroup
          value={constraintId}
          onChange={(event) => {
            const id = event.target.value;
            dispatch(changeConstraintId(id));
          }}
        >
          {constraints.map((constraint, index) => (
            <FormControlLabel
              key={index}
              value={constraint.id}
              control={<Radio />}
              label={formatMessage(intl)(
                R.prop(
                  constraint.tag === 'live'
                    ? 'pitFilterLiveValue'
                    : 'pitFilterPiTValue',
                  messages,
                ),
                { date: constraint.validFrom },
              )}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

export default PiTFilter;
