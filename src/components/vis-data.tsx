import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import { getViewer } from '../selectors/router';
import { getIsFull } from '../selectors';
import { getVisPageWidth } from '../selectors/app.js';
import VisTable from './vis-table';
import VisChart from './vis-chart';
import { ID_VIEWER_COMPONENT } from '../css-api';
import MicrodataViewer from './vis/microdata';
import useFooter from '../hooks/useFooter';

/**
 * Main Data Visualization Component
 * Routes to appropriate visualization based on type
 * Migrated to TypeScript
 */
const VisData: React.FC = () => {
  const type = useSelector(getViewer);
  const isFull = useSelector(getIsFull());
  const visPageWidth = useSelector(getVisPageWidth);
  const footerProps = useFooter();

  // Determine max width based on full screen mode
  const maxWidth = isFull ? window.innerWidth : visPageWidth;

  // Route to appropriate visualization component
  const renderVisualization = () => {
    switch (type) {
      case 'table':
        return (
          <VisTable
            maxWidth={maxWidth}
            isFull={isFull}
            footerProps={footerProps}
          />
        );
      
      case 'microdata':
        return (
          <MicrodataViewer 
            defaultFooterProps={footerProps}
          />
        );
      
      case 'bar':
      case 'line':
      case 'pie':
      case 'area':
      case 'scatter':
        return (
          <VisChart
            type={type as any}
            maxWidth={maxWidth}
            isFull={isFull}
            footerProps={footerProps}
          />
        );
      
      default:
        return (
          <Card>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              Unknown visualization type: {type}
            </div>
          </Card>
        );
    }
  };

  return (
    <div id={ID_VIEWER_COMPONENT}>
      {renderVisualization()}
    </div>
  );
};

export default VisData;
