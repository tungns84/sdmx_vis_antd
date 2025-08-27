import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import * as R from 'ramda';
import {
  Loading,
  NoData,
  DataFooter,
  DataHeader,
} from '@sis-cc/dotstatsuite-visions';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import { getData, getHeaderProps } from '../../../selectors/microdata';
import { getDisplay, getLocale } from '../../../selectors/router';
import { FormattedMessage, formatMessage } from '../../../i18n';
import { getAsset } from '../../../lib/settings';
import messages from '../../messages';
import Table from './table';
import { displayAccessor } from '../../../lib/sdmx/microdata';
import useSdmxMicrodata from '../../../hooks/useSdmxMicrodata';
import useSdmxStructure from '../../../hooks/useSdmxStructure';

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const MicrodataViewer = ({ defaultFooterProps }) => {
  const intl = useIntl();
  const classes = useStyles();
  const display = useSelector(getDisplay);
  const data = useSelector(getData);
  const localeId = useSelector(getLocale);
  const { isIncreased, observationsCount, contentConstraints } =
    useSdmxStructure();
  const header = useSelector(getHeaderProps);

  const { isLoading, isError, error } = useSdmxMicrodata();

  let errorMessage = null;
  let noDataMessage = null;
  if (isError) {
    const status = error?.response?.status;
    if (status === 404) {
      if (observationsCount == 0 || R.isEmpty(contentConstraints))
        noDataMessage = <FormattedMessage id="vx.no.data" />;
      else noDataMessage = <FormattedMessage id="vx.no.data.selection" />;
    } else if (R.includes(status, [401, 402, 403]))
      errorMessage = <FormattedMessage id="log.error.sdmx.40x" />;
    else errorMessage = <FormattedMessage id="log.error.sdmx.xxx" />;
  }

  const loadingProps = isIncreased ? { isWarning: true } : {};
  const loadingMessage = isIncreased ? (
    <FormattedMessage id="de.visualisation.data.larger.loading" />
  ) : (
    <FormattedMessage id="de.visualisation.data.loading" />
  );
  if (isLoading) return <Loading message={loadingMessage} {...loadingProps} />;

  if (errorMessage) return <NoData message={errorMessage} />;
  if (noDataMessage) return <NoData message={noDataMessage} />;

  const headerProps = R.over(
    R.lensPath(['title', 'label']),
    (label) => formatMessage(intl)(messages.microdataTitle, { label }),
    header,
  );

  const footerProps = {
    ...defaultFooterProps,
    source: {
      label: R.path(['title', 'label'], headerProps),
      link: window.location.href,
    },
    logo: getAsset('viewerFooter', localeId),
  };

  return (
    <div>
      <Divider className={classes.divider} />
      <DataHeader {...headerProps} />
      {!R.isNil(data) && (
        <Table displayAccessor={displayAccessor({ localeId, display })} />
      )}
      <DataFooter {...footerProps} />
    </div>
  );
};

MicrodataViewer.propTypes = {
  dataflow: PropTypes.object,
  defaultFooterProps: PropTypes.object,
};

export default MicrodataViewer;
