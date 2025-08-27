/**
 * SDMX Cell Component
 * Handles SDMX-specific cell rendering with flags, status, and formatting
 */

import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

// SDMX Observation Status codes
export enum ObservationStatus {
  A = 'Normal',
  B = 'Break in series',
  C = 'Confidential', 
  D = 'Significant change',
  E = 'Estimated',
  F = 'Forecast',
  M = 'Missing value',
  N = 'Not significant',
  P = 'Provisional',
}

// SDMX Observation Flags
export interface ObservationFlag {
  code?: string;
  label: string;
  type?: 'coded' | 'uncoded';
}

// Cell metadata interface
export interface SDMXCellData {
  value?: string | number | null;
  flags?: ObservationFlag[];
  status?: keyof typeof ObservationStatus;
  unit?: string;
  decimals?: number;
  multiplier?: number;
  metadata?: Record<string, any>;
}

interface SDMXCellProps extends SDMXCellData {
  isHeader?: boolean;
  isActive?: boolean;
  isHighlight?: boolean;
  onClick?: () => void;
  textAlign?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

/**
 * Format number value with SDMX rules
 */
const formatValue = (
  value: string | number | null | undefined,
  decimals?: number,
  multiplier?: number
): string => {
  if (value === null || value === undefined) {
    return '..';  // SDMX convention for no data
  }

  if (typeof value === 'string') {
    // Check for special SDMX values
    if (value === '-' || value === '...' || value === 'c') {
      return value;
    }
    // Try to parse as number
    const num = parseFloat(value);
    if (!isNaN(num)) {
      value = num;
    } else {
      return value;
    }
  }

  if (typeof value === 'number') {
    // Apply multiplier if specified
    let displayValue = value;
    if (multiplier) {
      displayValue = value * Math.pow(10, multiplier);
    }

    // Format with decimals
    if (decimals !== undefined) {
      return displayValue.toFixed(decimals);
    }
    
    // Default formatting
    return displayValue.toLocaleString();
  }

  return String(value);
};

/**
 * Render flags as superscript
 */
const FlagsDisplay: React.FC<{ flags: ObservationFlag[] }> = ({ flags }) => {
  if (!flags || flags.length === 0) return null;

  const codedFlags = flags.filter(f => f.code).map(f => f.code).join(',');
  const hasUncoded = flags.some(f => !f.code);
  
  const tooltipContent = (
    <ul style={{ paddingLeft: 20, margin: 0 }}>
      {flags.map((flag, idx) => (
        <li key={idx}>
          {flag.code ? `${flag.code}: ` : '* '}
          {flag.label}
        </li>
      ))}
    </ul>
  );

  return (
    <Tooltip title={tooltipContent} placement="top">
      <sup style={{ 
        color: '#1890ff',
        cursor: 'help',
        marginLeft: 2,
        fontWeight: 'bold',
      }}>
        {codedFlags}
        {codedFlags && hasUncoded && ','}
        {hasUncoded && '*'}
      </sup>
    </Tooltip>
  );
};

/**
 * Get status display symbol
 */
const getStatusSymbol = (status?: keyof typeof ObservationStatus): string => {
  switch (status) {
    case 'M': return '..';  // Missing
    case 'C': return 'c';   // Confidential
    case 'P': return 'p';   // Provisional
    case 'E': return 'e';   // Estimated
    case 'B': return 'b';   // Break
    default: return '';
  }
};

/**
 * SDMX Cell Component
 */
export const SDMXCell: React.FC<SDMXCellProps> = memo(({
  value,
  flags,
  status,
  unit,
  decimals,
  multiplier,
  metadata,
  isHeader,
  isActive,
  isHighlight,
  onClick,
  textAlign = 'right',
  style,
}) => {
  // Handle special status values
  if (status === 'M' || value === null || value === undefined) {
    return (
      <span style={{
        display: 'block',
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
      }}>
        ..
      </span>
    );
  }

  if (status === 'C') {
    return (
      <Tooltip title="Confidential data">
        <span style={{
          display: 'block',
          textAlign: 'center',
          color: '#ff4d4f',
          fontWeight: 'bold',
        }}>
          c
        </span>
      </Tooltip>
    );
  }

  // Format the value
  const formattedValue = formatValue(value, decimals, multiplier);
  
  // Build cell content
  const cellContent = (
    <>
      {/* Status indicator */}
      {status && status !== 'A' && (
        <Tooltip title={ObservationStatus[status]}>
          <sup style={{ 
            color: '#faad14',
            marginRight: 2,
            fontWeight: 'bold',
          }}>
            {getStatusSymbol(status)}
          </sup>
        </Tooltip>
      )}
      
      {/* Main value */}
      <span>{formattedValue}</span>
      
      {/* Unit if specified */}
      {unit && <span style={{ marginLeft: 4, color: '#666', fontSize: '0.9em' }}>{unit}</span>}
      
      {/* Flags */}
      <FlagsDisplay flags={flags || []} />
      
      {/* Metadata indicator */}
      {metadata && Object.keys(metadata).length > 0 && (
        <Tooltip title={
          <div>
            {Object.entries(metadata).map(([key, val]) => (
              <div key={key}>{key}: {String(val)}</div>
            ))}
          </div>
        }>
          <InfoCircleOutlined style={{ 
            marginLeft: 4,
            fontSize: 10,
            color: '#1890ff',
            cursor: 'help',
          }} />
        </Tooltip>
      )}
    </>
  );

  // Return cell content without wrapper td
  return cellContent;
});

SDMXCell.displayName = 'SDMXCell';

export default SDMXCell;
