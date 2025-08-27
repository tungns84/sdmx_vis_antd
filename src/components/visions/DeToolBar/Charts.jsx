import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import makeStyles from '@mui/styles/makeStyles';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Globe from '@mui/icons-material/Public';
import {
  Bar,
  Row,
  Scatter,
  HSymbol,
  VSymbol,
  Timeline,
  StackedBar,
  StackedRow,
} from '@sis-cc/dotstatsuite-visions';
import { getLocale } from '../../../selectors/router';
import { FormattedMessage, formatMessage } from '../../../i18n';
import { Button, Menu } from './helpers';
import { mapOptions, getMapName } from '../../../lib/settings';
import { CHART_IDS } from '../../../utils/constants';
import { toolbarMessages } from '../../messages';

const charts = [
  {
    Icon: Bar,
    id: CHART_IDS.BARCHART,
    message: <FormattedMessage id="de.visualisation.toolbar.chart.bar" />,
  },
  {
    Icon: Row,
    id: CHART_IDS.ROWCHART,
    message: <FormattedMessage id="de.visualisation.toolbar.chart.row" />,
  },
  {
    Icon: Scatter,
    id: CHART_IDS.SCATTERCHART,
    message: <FormattedMessage id="de.visualisation.toolbar.chart.scatter" />,
  },
  {
    Icon: HSymbol,
    id: CHART_IDS.HORIZONTALSYMBOLCHART,
    message: (
      <FormattedMessage id="de.visualisation.toolbar.chart.horizontalsymbol" />
    ),
  },
  {
    Icon: VSymbol,
    id: CHART_IDS.VERTICALSYMBOLCHART,
    message: (
      <FormattedMessage id="de.visualisation.toolbar.chart.verticalsymbol" />
    ),
  },
  {
    Icon: Timeline,
    id: CHART_IDS.TIMELINECHART,
    message: <FormattedMessage id="de.visualisation.toolbar.chart.timeline" />,
  },
  {
    Icon: StackedBar,
    id: CHART_IDS.STACKEDBARCHART,
    message: (
      <FormattedMessage id="de.visualisation.toolbar.chart.stacked.bar" />
    ),
  },
  {
    Icon: StackedRow,
    id: CHART_IDS.STACKEDROWCHART,
    message: (
      <FormattedMessage id="de.visualisation.toolbar.chart.stacked.row" />
    ),
  },
];

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: theme.spacing(4),
  },
}));

const Component = ({
  availableCharts,
  chart,
  changeChart,
  selected,
  hasRefAreaDimension,
}) => {
  const localeId = useSelector(getLocale);
  const classes = useStyles();
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const itemClick =
    (onClickHandler, ...args) =>
    () => {
      if (R.is(Function)(onClickHandler)) onClickHandler(...args);
      closeMenu();
    };

  const refinedCharts = R.map(
    (chart) => ({ ...chart, disabled: !R.has(chart.id, availableCharts) }),
    charts,
  );

  return (
    <React.Fragment>
      <Button
        startIcon={<AssessmentOutlinedIcon />}
        selected={R.or(selected, Boolean(anchorEl))}
        onClick={openMenu}
        aria-haspopup="true"
        data-testid="chart-button"
        aria-expanded={R.or(selected, Boolean(anchorEl))}
        disabled={R.isNil(refinedCharts) || R.isEmpty(refinedCharts)}
        isToolTip
      >
        {formatMessage(intl)(toolbarMessages.chart)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        data-testid="chart-menu"
      >
        {R.map(({ id, Icon, message, disabled }) => (
          <MenuItem
            className={classes.menuItem}
            key={id}
            onClick={itemClick(changeChart, id)}
            aria-pressed={R.equals(chart, id)}
            dense
            selected={R.equals(chart, id)}
            data-testid={`${id}-button`}
            id={id}
            disabled={disabled}
          >
            <ListItemIcon className={classes.icon}>
              <Icon fontSize="small" color={disabled ? '#666666' : 'primary'} />
            </ListItemIcon>
            <ListItemText
              id={id}
              primaryTypographyProps={{
                color: disabled ? '#666666' : 'primary',
              }}
            >
              {message}
            </ListItemText>
          </MenuItem>
        ))(refinedCharts)}
        {hasRefAreaDimension &&
          R.map(
            (map) => (
              <MenuItem
                key={map.id}
                onClick={itemClick(changeChart, CHART_IDS.CHOROPLETHCHART, {
                  map,
                })}
                aria-pressed={R.equals(chart, map.id)}
                aria-selected={R.equals(chart, map.id)}
                selected={R.equals(chart, map.id)}
                data-testid={`map-${map.id}-button`}
                dense
              >
                <ListItemIcon className={classes.icon}>
                  <Globe fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ color: 'primary' }}>
                  <FormattedMessage
                    id="chart.choropleth"
                    values={{ map: getMapName({ localeId })(map) }}
                  />
                </ListItemText>
              </MenuItem>
            ),
            mapOptions,
          )}
      </Menu>
    </React.Fragment>
  );
};

Component.propTypes = {
  availableCharts: PropTypes.object.isRequired,
  changeChart: PropTypes.func.isRequired,
  chart: PropTypes.string,
  selected: PropTypes.bool,
  hasRefAreaDimension: PropTypes.bool,
};

export default Component;
