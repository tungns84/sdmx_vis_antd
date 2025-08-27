import React from 'react';
import { withProfiler } from '@sentry/react';
import { Viewer } from '../../lib/dotstatsuite-antd/components';

// Table component is kept for data display (not a chart)
const Table = (props) => <Viewer {...props} />;

export default withProfiler(Table, { name: 'Visualisation table' });
