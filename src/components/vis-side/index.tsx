import React from 'react';
import { Space } from 'antd';
import DataAvailability from './data-availability';
import Filters from './filters';
import PiTFilter from './pit-filter';

interface SideProps {
  classes?: any; // Legacy prop, will be removed
}

/**
 * Side Panel Component
 * Contains all filters and controls for data visualization
 * Migrated to TypeScript
 */
const Side: React.FC<SideProps> = ({ classes }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters classes={classes} />
      <DataAvailability />
      <PiTFilter />
    </Space>
  );
};

export default Side;
