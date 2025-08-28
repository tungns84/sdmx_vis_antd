/**
 * SDMX Attributes and Annotations Parser
 * Handles SDMX-specific attributes, flags, and annotations
 */

import { ObservationFlag } from '../components/table/SDMXCell';

/**
 * Parse attributes from SDMX series
 */
export function parseSeriesAttributes(
  series: any,
  attributesMetadata: any
): Record<string, any> {
  const attributes: Record<string, any> = {};
  
  if (!series.attributes || !attributesMetadata?.series) {
    return attributes;
  }

  // Map attribute indices to metadata
  attributesMetadata.series.forEach((attrMeta: any, index: number) => {
    const value = series.attributes[index];
    if (value !== null && value !== undefined) {
      // Get the attribute value from metadata
      const attrValue = attrMeta.values?.[value];
      if (attrValue) {
        attributes[attrMeta.id] = {
          id: attrValue.id,
          name: attrValue.name || attrValue.names?.vi || attrValue.names?.en || attrValue.id,
          value: attrValue.id
        };
      } else {
        // Direct value (not coded)
        attributes[attrMeta.id] = value;
      }
    }
  });

  return attributes;
}

/**
 * Parse observation attributes and flags
 */
export function parseObservationAttributes(
  obsValue: any[],
  attributesMetadata: any
): { 
  status?: string;
  flags?: ObservationFlag[];
  metadata?: Record<string, any>;
} {
  const result: any = {};
  
  if (!obsValue || obsValue.length <= 1 || !attributesMetadata?.observation) {
    return result;
  }

  const flags: ObservationFlag[] = [];
  const metadata: Record<string, any> = {};

  // Process observation-level attributes (after the value)
  attributesMetadata.observation.forEach((attrMeta: any, index: number) => {
    // Observation attributes start at index 1 (index 0 is the value)
    const attrIndex = index + 1;
    const value = obsValue[attrIndex];
    
    if (value !== null && value !== undefined) {
      const attrId = attrMeta.id;
      
      // Handle special SDMX attributes
      if (attrId === 'OBS_STATUS') {
        // Get the status code
        const statusValue = attrMeta.values?.[value];
        if (statusValue) {
          result.status = statusValue.id;
          
          // Add as flag if not normal status
          if (statusValue.id !== 'A' && statusValue.id !== 'O') {
            flags.push({
              code: statusValue.id,
              label: statusValue.name || statusValue.id,
              type: 'coded'
            });
          }
        }
      } else if (attrId === 'OBS_CONF' || attrId === 'CONF_STATUS') {
        // Confidentiality status
        const confValue = attrMeta.values?.[value];
        if (confValue && confValue.id === 'C') {
          result.status = 'C';
          flags.push({
            code: 'C',
            label: 'Confidential',
            type: 'coded'
          });
        }
      } else if (attrId === 'OBS_PRE_BREAK') {
        // Pre-break value
        metadata.preBreak = value;
      } else if (attrId === 'TIME_FORMAT') {
        // Time format
        const formatValue = attrMeta.values?.[value];
        if (formatValue) {
          metadata.timeFormat = formatValue.id;
        }
      } else if (attrId === 'DECIMALS') {
        // Number of decimals
        result.decimals = parseInt(value);
      } else if (attrId === 'UNIT_MULT') {
        // Unit multiplier
        result.multiplier = parseInt(value);
      } else if (attrId === 'COMMENT' || attrId === 'OBS_COMMENT') {
        // Comments
        if (typeof value === 'string') {
          metadata.comment = value;
          // Add as uncoded flag
          flags.push({
            label: value,
            type: 'uncoded'
          });
        }
      } else {
        // Other attributes
        const attrValue = attrMeta.values?.[value];
        if (attrValue) {
          metadata[attrId] = {
            id: attrValue.id,
            name: attrValue.name || attrValue.id
          };
        } else {
          metadata[attrId] = value;
        }
      }
    }
  });

  if (flags.length > 0) {
    result.flags = flags;
  }

  if (Object.keys(metadata).length > 0) {
    result.metadata = metadata;
  }

  return result;
}

/**
 * Parse annotations from SDMX
 */
export function parseAnnotations(
  annotations: any[],
  targetId?: string
): Record<string, any> {
  const result: Record<string, any> = {};
  
  if (!annotations || annotations.length === 0) {
    return result;
  }

  annotations.forEach((annotation: any) => {
    // Check if annotation applies to this target
    if (targetId && annotation.target !== targetId) {
      return;
    }

    // Process annotation
    if (annotation.type === 'FOOTNOTE') {
      result.footnote = annotation.text || annotation.texts?.vi || annotation.texts?.en;
    } else if (annotation.type === 'EXAMPLE') {
      result.example = annotation.text || annotation.texts?.vi || annotation.texts?.en;
    } else if (annotation.type === 'NOTE') {
      result.note = annotation.text || annotation.texts?.vi || annotation.texts?.en;
    } else {
      // Generic annotation
      const key = annotation.type?.toLowerCase() || 'annotation';
      result[key] = annotation.text || annotation.texts?.vi || annotation.texts?.en;
    }
  });

  return result;
}

/**
 * Get status symbol for display
 */
export function getStatusSymbol(status: string): string {
  switch (status) {
    case 'A': return ''; // Normal (no symbol)
    case 'B': return 'b'; // Break in series
    case 'C': return 'c'; // Confidential
    case 'D': return 'd'; // Significant change
    case 'E': return 'e'; // Estimated
    case 'F': return 'f'; // Forecast
    case 'I': return 'i'; // Imputed
    case 'M': return '..'; // Missing value
    case 'N': return 'n'; // Not significant
    case 'O': return ''; // Normal/Official (no symbol)
    case 'P': return 'p'; // Provisional
    case 'R': return 'r'; // Revised
    case 'S': return 's'; // Strike
    case 'U': return 'u'; // Low reliability
    case 'V': return 'v'; // Unvalidated
    default: return '';
  }
}

/**
 * Format observation value with status
 */
export function formatObservationValue(
  value: any,
  status?: string,
  decimals?: number
): string {
  // Handle special status
  if (status === 'M' || value === null || value === undefined) {
    return '..';
  }
  
  if (status === 'C') {
    return 'c';
  }

  if (status === 'N' || value === '-') {
    return '-';
  }

  // Format numeric value
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const num = Number(value);
    if (decimals !== undefined) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString();
  }

  return String(value);
}
