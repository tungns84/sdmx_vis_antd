import React from 'react';
import { useSelector } from 'react-redux';
import { getViewer } from '../selectors/router';
import { getIsFull } from '../selectors';
import { getVisPageWidth } from '../selectors/app.js';
import Overview from './vis/overview';
import Tools from './vis-tools';
import VisTable from './vis-table';
import { ID_VIEWER_COMPONENT } from '../css-api';
import MicrodataViewer from './vis/microdata';
import useFooter from '../hooks/useFooter';
import VisChart from './vis-chart';
import MetaDataDrawer from './vis/meta-data-drawer';
import MicrodataTitle from './vis/microdata/title';
import useSdmxData from '../hooks/useSdmxData';

const VisDataWrapper = ({ children }) => {
  return (
    <>
      <MetaDataDrawer />
      {children}
    </>
  );
};

const VisData = () => {
  const type = useSelector(getViewer);
  const isFull = useSelector(getIsFull());
  const visPageWidth = useSelector(getVisPageWidth);
  const footerProps = useFooter();

  useSdmxData();

  if (type === 'overview') {
    return (
      <VisDataWrapper>
        <>
          <Tools maxWidth={visPageWidth} isFull={isFull} />
          <Overview />
        </>
      </VisDataWrapper>
    );
  }

  if (type === 'table') {
    return (
      <VisDataWrapper>
        <VisTable
          maxWidth={visPageWidth}
          isFull={isFull}
          footerProps={footerProps}
        />
      </VisDataWrapper>
    );
  }

  if (type === 'microdata') {
    return (
      <>
        <MicrodataTitle />
        <VisDataWrapper>
          <>
            <Tools maxWidth={visPageWidth} isFull={isFull} />
            <div id={ID_VIEWER_COMPONENT}>
              <MicrodataViewer defaultFooterProps={footerProps} />
            </div>
          </>
        </VisDataWrapper>
      </>
    );
  }

  return (
    <VisDataWrapper>
      <VisChart
        type={type}
        maxWidth={visPageWidth}
        isFull={isFull}
        footerProps={footerProps}
      />
    </VisDataWrapper>
  );
};

export default VisData;
