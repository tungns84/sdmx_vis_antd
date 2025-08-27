import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { Row, Col, Spin, Alert, Typography, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import FiltersHelp from './filters-help';
import { FormattedMessage } from '../i18n';
import { getIsFull } from '../selectors';
import { getExtAuthOptions, getVisPageWidth } from '../selectors/app.js';
import { getIsMicrodata } from '../selectors/microdata';
import { getDataflow } from '../selectors/router';
import Side from './vis-side';
import NarrowFilters from './vis-side/side-container';
import { ID_VIS_PAGE } from '../css-api';
import ScrollToButtons from './vis/ScrollToButtons';
import {
  MARGE_RATIO,
  MARGE_SIZE,
  SIDE_WIDTH,
  SMALL_SIDE_WIDTH,
} from '../utils/constants';
import useSdmxStructure from '../hooks/useSdmxStructure';
import { getDatasource } from '../selectors/sdmx';
import SpaceAuthDialog from './SpaceAuthDialog';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';
import VisPage from './vis/vis-page';
import VisSurvey from './vis-survey';
import VisDataPoints from './vis-data-points';
import VisUserFilters from './vis-used-filters';
import VisData from './vis-data';
import styles from './vis.module.css';

const { Text } = Typography;

/**
 * Main Visualization Component
 * Migrated to AntD + TypeScript
 * Handles data visualization, filters, and layout
 */
const Vis: React.FC = () => {
  const isFull = useSelector(getIsFull());
  const isMicrodata = useSelector(getIsMicrodata);
  const visPageWidth = useSelector(getVisPageWidth);
  const datasource = useSelector(getDatasource);
  const dataflow = useSelector(getDataflow);
  const { isLoading: isLoadingStructure, isError, error } = useSdmxStructure();

  // Hooks for SDMX data
  useSdmxACForFrequency();
  useSdmxACForTimePeriod();

  // Check if we're on mobile/narrow screen
  const [isNarrow, setIsNarrow] = React.useState(false);
  React.useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 960); // md breakpoint
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Error message handling
  let errorMessage: React.ReactNode = null;
  if (isError) {
    const status = error?.response?.status;
    if (R.isEmpty(datasource)) {
      errorMessage = (
        <FormattedMessage
          id="log.error.sdmx.invalid.space"
          values={{ space: dataflow.datasourceId }}
        />
      );
    } else if (status === 404) {
      errorMessage = <FormattedMessage id="log.error.sdmx.404" />;
    } else if (R.includes(status, [401, 402, 403])) {
      errorMessage = <FormattedMessage id="log.error.sdmx.40x" />;
    } else {
      errorMessage = <FormattedMessage id="log.error.sdmx.xxx" />;
    }
  }

  // External authentication check
  const { hasFailed, credentials, isAnonymous } = useSelector(
    getExtAuthOptions(datasource.id)
  );
  const isExtAuthenticated = !!credentials || isAnonymous;
  const isExtAuthCandidate = datasource.hasExternalAuth && !isExtAuthenticated;

  if (isExtAuthCandidate) {
    return <SpaceAuthDialog datasource={datasource} />;
  }

  return (
    <>
      {hasFailed && (
        <SpaceAuthDialog datasource={datasource} hasFailed={hasFailed} />
      )}
      
      {isLoadingStructure && (
        <div className="sr-only" aria-live="assertive">
          <FormattedMessage id="de.visualisation.loading" />
        </div>
      )}

      <VisPage id={ID_VIS_PAGE}>
        {/* Error State */}
        {isError && (
          <div className={styles.centerContent}>
            <Alert
              message="Error Loading Data"
              description={errorMessage}
              type="error"
              showIcon
            />
          </div>
        )}

        {/* Loading State */}
        {isLoadingStructure && (
          <div className={styles.centerContent}>
            <Space direction="vertical" align="center" size="large">
              <Spin 
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                size="large"
              />
              <Text type="secondary">
                <FormattedMessage id="de.visualisation.loading" />
              </Text>
            </Space>
          </div>
        )}

        {/* Main Content */}
        {!isError && !isLoadingStructure && (
          <div className={styles.mainContainer}>
            <VisSurvey />
            
            {/* Filters Help - Desktop only */}
            {!isFull && !isMicrodata && !isNarrow && (
              <div className={styles.filtersHelp}>
                <FiltersHelp />
              </div>
            )}

            <Row gutter={[16, 16]} wrap={isNarrow}>
              {/* Side Panel - Filters */}
              {!isFull && !isMicrodata && (
                <Col 
                  xs={24} 
                  md={8} 
                  lg={6}
                  className={styles.sidePanel}
                >
                  <NarrowFilters isNarrow={isNarrow}>
                    <Side classes={{}} />
                  </NarrowFilters>
                </Col>
              )}

              {/* Main Content Area */}
              <Col 
                xs={24} 
                md={isFull || isMicrodata ? 24 : 16} 
                lg={isFull || isMicrodata ? 24 : 18}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <VisUserFilters />
                  <VisDataPoints />
                  <div className={styles.visContainer}>
                    <VisData />
                  </div>
                </Space>
              </Col>
            </Row>

            <ScrollToButtons />
          </div>
        )}
      </VisPage>
    </>
  );
};

export default Vis;
