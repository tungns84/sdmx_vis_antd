import React, { useState } from 'react';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import numeral from 'numeral';
import dateFns from 'date-fns';
import { getDateLocale } from '../../i18n/dates';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import { Alert, CollapsibleTree } from '@sis-cc/dotstatsuite-visions';
import DownloadIcon from '@mui/icons-material/GetApp';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { FormattedMessage, formatMessage } from '../../i18n';
import Container from '@mui/material/Container';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { useIntl } from 'react-intl';
import {
  getIsOpen,
  getAttributesSeries,
  getCoordinates,
} from '../../selectors/metadata';
import { getVisDataflow, getDataDimensions } from '../../selectors';
import { getDisplay, getLocale } from '../../selectors/router';
import { getHeaderCoordinates } from '../../selectors/data.js';
import { closeMetadata } from '../../ducks/metadata';
import { locales } from '../../lib/settings';
import { getSidebarData } from '../../lib/sdmx/metadata.js';
import messages from '../messages';
import SanitizedInnerHTML from '../SanitizedInnerHTML';
import useSdmxMetadata from '../../hooks/useSdmxMetadata.js';
import useMetadataDowload from '../../hooks/useMetadataDowload.js';
import { requestCsvDataFile } from '../../ducks/sdmx.js';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(1),
  },
  backdrop: {
    backgroundColor: 'unset',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  closeDrawer: {
    float: 'right',
  },
  downloading: {
    width: '15px !important',
    height: '15px !important',
  },
}));

const MetaDataDrawer = () => {
  const dispatch = useDispatch();
  const [extended, setExtended] = useState(false);
  const downloadController = useMetadataDowload({ isFull: false });
  const isOpen = useSelector(getIsOpen);
  const { metadataSeries, isLoading } = useSdmxMetadata();
  const headerCoordinates = useSelector(getHeaderCoordinates);
  const selectedCoordinates = useSelector(getCoordinates);
  const attributesSeries = useSelector(getAttributesSeries);
  const dataflow = useSelector(getVisDataflow);
  const dimensions = useSelector(getDataDimensions());
  const display = useSelector(getDisplay);
  const locale = useSelector(getLocale);
  const intl = useIntl();
  const isNarrow = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classes = useStyles();

  const options = {
    display,
    attributesLabel: formatMessage(intl)(messages.advancedAttrs),
    isHeader: R.equals(headerCoordinates, selectedCoordinates),
  };

  const sidebarData = getSidebarData(
    attributesSeries,
    metadataSeries,
    dataflow,
    dimensions,
    options,
  );

  const valueHandler = ({ value, format }) => {
    if (R.isNil(value)) {
      return value;
    }
    if (format === 'Numeric' || format === 'Integer' || format === 'Decimal') {
      return numeral(Number(value)).format(`0,0.[0000000]`);
    }
    if (format === 'Boolean') {
      if (R.is(String, value)) {
        if (R.toLower(value) === 'true') {
          return formatMessage(intl)(messages.dataTrue);
        }
        if (R.toLower(value) === 'false') {
          return formatMessage(intl)(messages.dataFalse);
        }
      }
      return value
        ? formatMessage(intl)(messages.dataTrue)
        : formatMessage(intl)(messages.dataFalse);
    }
    if (format === 'GregorianYearMonth') {
      return dateFns.format(
        new Date(value),
        R.pathOr('YYYY-MMM', [locale, 'timeFormat'], locales),
        { locale: getDateLocale(locale) },
      );
    }
    return value;
  };

  const closeDrawer = () => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    dispatch(closeMetadata());
  };

  const onDownload = () => {
    downloadController.download();
    dispatch(requestCsvDataFile({ filename: downloadController.filename }));
  };

  const sideLabels = {
    collapseAll: formatMessage(intl)(messages.metadataCollapse),
    expandAll: formatMessage(intl)(messages.metadataExpand),
    noValue: formatMessage(intl)(messages.metadataNoValue),
    noData: formatMessage(intl)(messages.metadataEmpty),
  };

  return (
    <Drawer
      data-testid="ref-md-panel"
      className={classes.drawer}
      anchor="right"
      open={isOpen}
      classes={{ paper: classes.drawerPaper }}
      PaperProps={{
        style: { width: extended ? (isNarrow ? '100%' : 990) : 450 },
      }}
      BackdropProps={{ invisible: true }}
      onClose={closeDrawer()}
    >
      <div
        style={{
          marginTop: '70px',
        }}
      />
      <Container disableGutters>
        <IconButton
          size="small"
          className={classes.closeDrawer}
          onClick={closeDrawer()}
          data-testid="ref-md-panel-close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="metadata.information.title" />
        </Typography>
      </Container>
      {downloadController.error && (
        <Alert
          color="error"
          variant="filled"
          data-testid="metadata.download.csv.selection.error"
        >
          <strong>
            <FormattedMessage id="data.download.csv.error" />
          </strong>
          {R.propOr('', 'message', downloadController.error)}
        </Alert>
      )}
      <CollapsibleTree
        data={sidebarData}
        defaultParentExtended={true}
        defaultValueExtented={true}
        isLoading={isLoading}
        labels={sideLabels}
        onClick={() => setExtended(!extended)}
        icon={
          extended ? (
            <SvgIcon
              focusable="false"
              aria-hidden="true"
              data-testid="ZoomInMapIcon"
              tabindex="-1"
              viewBox="0 0 24 24"
              title="ZoomInMapIcon"
            >
              <path d="M9 9V3H7v2.59L3.91 2.5 2.5 3.91 5.59 7H3v2zm12 0V7h-2.59l3.09-3.09-1.41-1.41L17 5.59V3h-2v6zM3 15v2h2.59L2.5 20.09l1.41 1.41L7 18.41V21h2v-6zm12 0v6h2v-2.59l3.09 3.09 1.41-1.41L18.41 17H21v-2z"></path>
            </SvgIcon>
          ) : (
            <ZoomOutMapIcon />
          )
        }
        valueHandler={({ value, format }) => (
          <SanitizedInnerHTML html={valueHandler({ value, format })} />
        )}
      >
        {!isLoading &&
          !downloadController.isLoading &&
          !R.isNil(metadataSeries) &&
          !R.isEmpty(metadataSeries) && (
            <Button
              data-testid="metadata.download.csv.selection-button"
              color="primary"
              endIcon={<DownloadIcon />}
              onClick={onDownload}
            >
              <FormattedMessage id="metadata.download" />
            </Button>
          )}
        {!isLoading && downloadController.isLoading && (
          <CircularProgress className={classes.downloading} />
        )}
      </CollapsibleTree>
    </Drawer>
  );
};

export default MetaDataDrawer;
