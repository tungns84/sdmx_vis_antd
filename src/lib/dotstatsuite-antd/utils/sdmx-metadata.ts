/**
 * SDMX Metadata Utilities
 * Utilities for extracting and processing SDMX metadata from observations
 */

import { ObservationFlag } from '../components/table/SDMXCell';

/**
 * Extract observation attributes from SDMX observation
 */
export const extractObservationAttributes = (observation: any): {
  flags?: ObservationFlag[];
  status?: string;
  unit?: string;
  decimals?: number;
  multiplier?: number;
  metadata?: Record<string, any>;
} => {
  const result: any = {};

  // Extract OBS_STATUS
  if (observation.OBS_STATUS) {
    result.status = observation.OBS_STATUS;
  }

  // Extract flags from attributes
  const flags: ObservationFlag[] = [];

  // Standard SDMX flags
  if (observation.OBS_FLAG) {
    const flagCodes = observation.OBS_FLAG.split(',');
    flagCodes.forEach((code: string) => {
      flags.push({
        code: code.trim(),
        label: getFlagDescription(code.trim()),
        type: 'coded'
      });
    });
  }

  // Footnotes
  if (observation.FOOTNOTE) {
    flags.push({
      label: observation.FOOTNOTE,
      type: 'uncoded'
    });
  }

  if (flags.length > 0) {
    result.flags = flags;
  }

  // Extract unit and multiplier
  if (observation.UNIT_MEASURE) {
    result.unit = observation.UNIT_MEASURE;
  }

  if (observation.UNIT_MULT) {
    result.multiplier = parseInt(observation.UNIT_MULT, 10);
  }

  if (observation.DECIMALS) {
    result.decimals = parseInt(observation.DECIMALS, 10);
  }

  // Extract any other metadata
  const metadataKeys = Object.keys(observation).filter(key => 
    !['OBS_VALUE', 'OBS_STATUS', 'OBS_FLAG', 'FOOTNOTE', 'UNIT_MEASURE', 'UNIT_MULT', 'DECIMALS']
      .includes(key) && 
    key.startsWith('OBS_') || key.startsWith('ATTR_')
  );

  if (metadataKeys.length > 0) {
    result.metadata = {};
    metadataKeys.forEach(key => {
      result.metadata[key] = observation[key];
    });
  }

  return result;
};

/**
 * Get flag description from code
 */
const getFlagDescription = (code: string): string => {
  const flagDescriptions: Record<string, string> = {
    'p': 'Provisional',
    'P': 'Provisional',
    'e': 'Estimated',
    'E': 'Estimated',
    'f': 'Forecast',
    'F': 'Forecast',
    'b': 'Break in series',
    'B': 'Break in series',
    'c': 'Confidential',
    'C': 'Confidential',
    'd': 'Definition differs',
    'D': 'Definition differs',
    'i': 'See metadata',
    'I': 'See metadata',
    'k': 'Data included in another category',
    'K': 'Data included in another category',
    'm': 'Missing value/Not available',
    'M': 'Missing value/Not available',
    'n': 'Not significant',
    'N': 'Not significant',
    'r': 'Revised',
    'R': 'Revised',
    's': 'Strike',
    'S': 'Strike',
    'u': 'Low reliability',
    'U': 'Low reliability',
  };

  return flagDescriptions[code] || `Flag: ${code}`;
};

/**
 * Format time period for display
 */
export const formatTimePeriod = (timePeriod: string): string => {
  if (!timePeriod) return timePeriod;

  // Annual: 2023
  if (/^\d{4}$/.test(timePeriod)) {
    return timePeriod;
  }

  // Quarterly: 2023-Q1
  if (/^\d{4}-Q[1-4]$/.test(timePeriod)) {
    const [year, quarter] = timePeriod.split('-');
    return `${quarter} ${year}`;
  }

  // Monthly: 2023-01 or 2023-M01
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(timePeriod) || /^\d{4}-M(0[1-9]|1[0-2])$/.test(timePeriod)) {
    const parts = timePeriod.replace('M', '').split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${monthNames[monthIndex]} ${parts[0]}`;
  }

  // Weekly: 2023-W52
  if (/^\d{4}-W\d{2}$/.test(timePeriod)) {
    const [year, week] = timePeriod.split('-');
    return `${week} ${year}`;
  }

  // Daily: 2023-01-31
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(timePeriod)) {
    const date = new Date(timePeriod);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Default: return as-is
  return timePeriod;
};

/**
 * Get cell click handler for navigation/drill-down
 */
export const getCellClickHandler = (observation: any, dimensions: any[]) => {
  return () => {
    // Build context for drill-down
    const context = {
      dimensions: dimensions.reduce((acc, dim) => {
        acc[dim.id] = observation[dim.id];
        return acc;
      }, {} as Record<string, string>),
      value: observation.OBS_VALUE,
      attributes: extractObservationAttributes(observation)
    };

    console.log('Cell clicked:', context);
    // In real implementation, this would navigate or show detail view
  };
};
