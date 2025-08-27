import React, { useRef, useEffect, useState } from 'react';
import { ViewerProps } from '../types';
import Loading from './basic/Loading';
import NoData from './basic/NoData';
import SDMXTableHTML from './table/SDMXTableHTML';
// import Chart from './chart/Chart'; // Will implement later with D3

interface ViewerWrapperProps extends ViewerProps {
  width?: number;
  height?: number;
  locale?: string;
  timeFormats?: any;
}

const ViewContent: React.FC<ViewerWrapperProps> = ({
  type,
  loading,
  error,
  data,
  tableProps,
  chartProps,
  width,
}) => {
  if (loading) {
    return <Loading message="Loading data..." />;
  }

  if (error) {
    return <NoData message={error} description="Please try again later" />;
  }

  if (type === 'table') {
    if (!tableProps?.data?.observations?.length) {
      return <NoData message="No data available" />;
    }
    return <SDMXTableHTML {...tableProps} />;
  }

  if (type === 'chart') {
    // TODO: Implement chart with D3
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Chart visualization will be implemented with D3.js</p>
      </div>
    );
  }

  return null;
};

const Viewer: React.FC<ViewerWrapperProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: props.width || '100%',
    height: props.height || '100%',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    overflow: 'auto',
    position: 'relative',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {props.headerProps && (
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa' 
        }}>
          {/* Header content */}
          {props.headerProps.title && (
            <h3 style={{ margin: 0 }}>{props.headerProps.title}</h3>
          )}
          {props.headerProps.subtitle && (
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              {props.headerProps.subtitle}
            </p>
          )}
        </div>
      )}

      <div style={{ padding: props.type === 'table' ? 0 : '16px' }}>
        <ViewContent {...props} width={dimensions.width} />
      </div>

      {props.footerProps && (
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa' 
        }}>
          {/* Footer content */}
          {props.footerProps.source && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Source: {props.footerProps.source}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Viewer;
