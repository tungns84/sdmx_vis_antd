import { ExpansionPanel } from '@sis-cc/dotstatsuite-visions';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { FormattedMessage, formatMessage } from '../../i18n';
import { getFilter } from '../../selectors';
import {
  getHasDataAvailability,
  getIsDataAvaibilityInState,
} from '../../selectors/router';
import { PANEL_CONTENT_CONSTRAINTS } from '../../utils/constants';
import { changeFilter } from '../../ducks/vis';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import makeStyles from '@mui/styles/makeStyles';
import { applyDataAvailability } from '../../ducks/sdmx';
import messages from '../messages';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 0,
  },
}));

const DataAvailability = () => {
  const classes = useStyles();
  const intl = useIntl();
  const activePanelId = useSelector(getFilter);
  const isOpen = PANEL_CONTENT_CONSTRAINTS === activePanelId;
  const isActive = useSelector(getIsDataAvaibilityInState);
  const isBlank = !isActive;
  const dataAvailability = useSelector(getHasDataAvailability);
  const isChecked = dataAvailability;

  const dispatch = useDispatch();
  const changeFilterHandler = (...args) => dispatch(changeFilter(...args));
  const onChangeHandler = (...args) => dispatch(applyDataAvailability(...args));

  return (
    <ExpansionPanel
      id={PANEL_CONTENT_CONSTRAINTS}
      label={formatMessage(intl)(messages.dataAvailability)}
      isBlank={isBlank}
      isOpen={isOpen}
      onChangeActivePanel={changeFilterHandler}
    >
      <FormControl component="fieldset">
        <FormControlLabel
          classes={{ root: classes.root }}
          checked={isChecked}
          control={
            <Checkbox
              onChange={() => onChangeHandler(!isChecked)}
              value="hasDataAvailability"
            />
          }
          label={<FormattedMessage id="de.contentConstraints.checkbox.label" />}
        />
      </FormControl>
    </ExpansionPanel>
  );
};

export default DataAvailability;
