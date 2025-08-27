import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import makeStyles from '@mui/styles/makeStyles';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { FormattedMessage } from '../../i18n';
import * as R from 'ramda';
import { guidancesMessages } from '../messages';
import { MARGE_RATIO, MARGE_SIZE } from '../../utils/constants';

const groupedGuidanceMessages = {
  BarChart: guidancesMessages.bar,
  RowChart: guidancesMessages.row,
  ScatterChart: guidancesMessages.scatter,
  HorizontalSymbolChart: guidancesMessages.hsymbol,
  VerticalSymbolChart: guidancesMessages.vsymbol,
  TimelineChart: guidancesMessages.timeline,
  StackedBarChart: guidancesMessages.stackedBar,
  StackedRowChart: guidancesMessages.stackedRow,
  ChoroplethChart: guidancesMessages.choro,
};

const useStyles = makeStyles(() => ({
  container: {
    position: 'sticky',
    left: `${MARGE_SIZE}%`,
  },
  accordion: {
    boxShadow: 'none',
  },
  guidances: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Guidances = ({ type, maxWidth = 0 }) => {
  const classes = useStyles();
  const contentMessage = R.prop(type, groupedGuidanceMessages);
  if (R.isNil(contentMessage)) {
    return null;
  }
  const summaryMessage =
    type === 'table' ? guidancesMessages.table : guidancesMessages.chart;
  return (
    <div
      className={classes.container}
      style={{ maxWidth: maxWidth * MARGE_RATIO }}
    >
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <EmojiObjectsIcon fontSize="small" />
          <FormattedMessage {...summaryMessage} />
        </AccordionSummary>
        <AccordionDetails className={classes.guidances}>
          <Typography variant="body2">
            <FormattedMessage {...contentMessage} />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Guidances;
