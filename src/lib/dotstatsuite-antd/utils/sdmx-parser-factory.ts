/**
 * SDMX Parser Factory
 * Supports multiple SDMX-JSON versions with unified output format
 */

import { SDMXData } from '../types';
import { SDMXVersion } from './sdmx-parser-base';
import { parseSDMXJSON as parseV1 } from './sdmx-json-parser';
import { parseSDMXJSONV2 } from './sdmx-json-v2-parser';

/**
 * Detect SDMX-JSON version from data structure
 */
export function detectSDMXVersion(data: any): SDMXVersion {
  // SDMX-JSON 2.0+ has "meta" object with "schema" property
  if (data.meta?.schema) {
    const schema = data.meta.schema;
    if (schema.includes('2.0')) return SDMXVersion.V2_0;
    if (schema.includes('2.1')) return SDMXVersion.V2_1;
  }
  
  // SDMX-JSON 2.0+ may have "data" instead of "dataSets"
  if (data.data && !data.dataSets) {
    return SDMXVersion.V2_0;
  }
  
  // SDMX-JSON 1.0 characteristics
  if (data.dataSets && data.structures) {
    // Check for index-based series keys (1.0 format)
    const firstDataSet = data.dataSets[0];
    if (firstDataSet?.series) {
      const firstSeriesKey = Object.keys(firstDataSet.series)[0];
      // If series key contains colons, it's likely v1.0
      if (firstSeriesKey?.includes(':')) {
        return SDMXVersion.V1_0;
      }
    }
  }
  
  // Default to 1.0 for backward compatibility
  return SDMXVersion.V1_0;
}

/**
 * Parse SDMX-JSON data with version support
 * 
 * @param data - Raw SDMX-JSON data
 * @param version - SDMX version (default: auto-detect)
 * @param locale - Locale for data localization (default: 'en')
 * @returns Unified SDMXData format for table display
 */
export function parseSDMX(
  data: any,
  version: SDMXVersion = SDMXVersion.AUTO,
  locale: string = 'en'
): SDMXData {
  // Auto-detect version if needed
  const actualVersion = version === SDMXVersion.AUTO 
    ? detectSDMXVersion(data) 
    : version;
  
  console.log(`Parsing SDMX-JSON version: ${actualVersion} with locale: ${locale}`);
  
  // Select appropriate parser based on version
  switch (actualVersion) {
    case SDMXVersion.V1_0:
      return parseV1(data, locale);
      
    case SDMXVersion.V2_0:
    case SDMXVersion.V2_1:
      return parseSDMXJSONV2(data, locale);
      
    default:
      console.warn(`Unknown SDMX version: ${actualVersion}, falling back to v1.0`);
      return parseV1(data, locale);
  }
}

// Export types from base module for convenience
export { SDMXVersion } from './sdmx-parser-base';
export type { SDMXParser, BaseSDMXParser } from './sdmx-parser-base';
