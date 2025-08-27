import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import useTheme from '@mui/material/styles/useTheme';
import makeStyles from '@mui/styles/makeStyles';
import GetAppIcon from '@mui/icons-material/GetApp';
import Divider from '@mui/material/Divider';
import { useIntl } from 'react-intl';
import { formatMessage } from '../../../i18n';
import { Button, Menu } from './helpers';
import messages, { toolbarMessages, visDlMessages } from '../../messages';
import { getViewer } from '../../../selectors/router';
import {
  CHART_IDS,
  EXCEL,
  MICRODATA,
  PNG,
  TABLE,
} from '../../../utils/constants';
import { downloadPng, downloadExcel, csvDlStartTick } from '../../../ducks/vis';
import html2canvas from 'html2canvas';
import { ID_VIEWER_COMPONENT } from '../../../css-api';
import { cellsLimit } from '../../../lib/settings';
import Link from './Link';
import ActionButton from './ActionButton';
import useOverview from '../../../hooks/useOverview';
import useSdmxStructure from '../../../hooks/useSdmxStructure';
import useDataDownload from '../../../hooks/useDataDownload';
import useMetadataDowload from '../../../hooks/useMetadataDowload';
import { requestCsvDataFile } from '../../../ducks/sdmx';
import { ProfiledDownloadExcelButton } from '../../profiled/action-button';

const useStyles = makeStyles((theme) => ({
  linkEnd: {
    margin: 0,
    padding: theme.spacing(0.75, 2),
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'end',
  },
  linkStart: {
    margin: 0,
    padding: theme.spacing(0.75, 2),
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
  },
  linkIcon: {
    height: 20,
    paddingRight: theme.spacing(1),
    alignItems: 'center',
  },
}));

const Download = ({ loading, viewerProps }) => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const theme = useTheme();
  const filteredDataDlController = useDataDownload({ isFull: false });
  const fullDataDlController = useDataDownload({ isFull: true });
  const fullMetadataDlController = useMetadataDowload({ isFull: true });
  const viewerId = useSelector(getViewer);
  const { externalResources = [] } = useSdmxStructure();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const overviewProps = useOverview();
  const enhanceTableProps = R.pipe(
    R.set(
      R.lensPath(['footerProps', 'copyright', 'content']),
      formatMessage(intl)(messages.viewerLinkLabel),
    ),
    R.set(
      R.lensPath(['footerProps', 'copyright', 'link']),
      formatMessage(intl)(messages.viewerLink),
    ),
    R.over(R.lensPath(['headerProps', 'disclaimer']), (disclaimer) =>
      R.isNil(disclaimer)
        ? null
        : formatMessage(intl)(messages.incompleteExcelData, { cellsLimit }),
    ),
  );

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const isLoading =
    loading ||
    filteredDataDlController.isLoading ||
    fullDataDlController.isLoading ||
    fullMetadataDlController.isLoading;

  return (
    <React.Fragment>
      <Button
        startIcon={<GetAppIcon />}
        selected={Boolean(anchorEl)}
        loading={isLoading}
        onClick={openMenu}
        aria-haspopup="true"
        data-testid="downloads-button"
        aria-expanded={Boolean(anchorEl)}
        isToolTip
      >
        {formatMessage(intl)(toolbarMessages.download)}
      </Button>
      <Menu
        data-testid="downloads-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {viewerId === TABLE && (
          <ProfiledDownloadExcelButton
            intl={intl}
            id="excel.selection"
            key="excel.selection"
            onClick={() => {
              dispatch(
                downloadExcel({
                  ...enhanceTableProps(viewerProps),
                  overviewProps,
                  id: EXCEL,
                  theme,
                }),
              );
              closeMenu();
            }}
          />
        )}
        {viewerId === MICRODATA && (
          <ActionButton intl={intl} id="microdata.download.excel.selection" />
        )}
        {R.includes(viewerId, R.values(CHART_IDS)) && (
          <ActionButton
            id="chart.selection"
            intl={intl}
            onClick={() => {
              const base = viewerProps?.chartOptions?.base;
              const width = base?.width;
              const height = base?.height;
              let options = { scale: 2, scrollY: -window.scrollY };
              if (!R.isNil(width)) options.width = width;
              if (!R.isNil(height)) options.height = height;
              dispatch(
                downloadPng(
                  () =>
                    html2canvas(
                      document.getElementById(ID_VIEWER_COMPONENT),
                      options,
                    ),
                  PNG,
                ),
              );
              closeMenu();
            }}
          />
        )}
        {R.map(
          ({ key, id, directLink, download, filename, isEnabled }) =>
            directLink.isEnabled ? (
              <li
                key={key}
                role="menuitem"
                tabIndex={0}
                aria-label={formatMessage(intl)(R.prop(id, visDlMessages))}
                aria-disabled={!isEnabled}
              >
                <Link
                  callback={() => {
                    dispatch(csvDlStartTick());
                    dispatch(requestCsvDataFile({ filename }));
                    closeMenu();
                  }}
                  classes={classes}
                  filename={`${filename}.csv`}
                  id={key}
                  disabled={!isEnabled}
                  justifyContent="start"
                  label={formatMessage(intl)(R.prop(id, visDlMessages))}
                  link={directLink.url}
                />
              </li>
            ) : (
              <li
                key={key}
                role="menuitem"
                tabIndex={0}
                aria-label={formatMessage(intl)(R.prop(id, visDlMessages))}
                aria-disabled={!isEnabled}
              >
                <ActionButton
                  intl={intl}
                  disabled={!isEnabled}
                  key={key}
                  id={id}
                  onClick={() => {
                    download();
                    dispatch(requestCsvDataFile({ filename }));
                    closeMenu();
                  }}
                />
              </li>
            ),
          [
            {
              ...filteredDataDlController,
              key: 'csv.selection',
              id: `${
                viewerId === MICRODATA ? 'microdata' : 'data'
              }.download.csv.selection`,
            },
            {
              ...fullDataDlController,
              key: 'csv.all',
              id: `${
                viewerId === MICRODATA ? 'microdata' : 'data'
              }.download.csv.all`,
            },
            {
              ...fullMetadataDlController,
              key: 'metadata.all',
              id: 'metadata.download.csv.all',
            },
          ],
        )}
        {R.not(R.isEmpty(externalResources)) && <Divider />}
        {R.map(
          ({ key, ...props }) => (
            <Link
              {...props}
              key={key}
              callback={() => closeMenu()}
              classes={classes}
              justifyContent="end"
            />
          ),
          externalResources,
        )}
      </Menu>
    </React.Fragment>
  );
};

Download.propTypes = {
  loading: PropTypes.bool,
  viewerProps: PropTypes.object,
  overviewProps: PropTypes.object,
};

export default Download;
