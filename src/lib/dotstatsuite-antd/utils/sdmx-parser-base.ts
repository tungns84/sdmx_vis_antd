/**
 * SDMX Parser Base Classes and Types
 * Separated to avoid circular dependencies
 */

import { SDMXData } from '../types';

export enum SDMXVersion {
  V1_0 = '1.0', // SDMX 2.1 standard
  V2_0 = '2.0', // SDMX 3.0 standard
  V2_1 = '2.1', // SDMX 3.1 standard
  AUTO = 'auto' // Auto-detect version
}

/**
 * Version-specific parser interface
 * All parsers must implement this interface to ensure unified output
 */
export interface SDMXParser {
  /**
   * Parse raw SDMX data
   * @returns Unified SDMXData format
   */
  parse(data: any): SDMXData;
  
  /**
   * Get parser version
   */
  version: SDMXVersion;
  
  /**
   * Validate if data matches this parser's format
   */
  canParse(data: any): boolean;
}

/**
 * Base parser class with common functionality
 */
export abstract class BaseSDMXParser implements SDMXParser {
  abstract version: SDMXVersion;
  abstract parse(data: any): SDMXData;
  abstract canParse(data: any): boolean;
  
  /**
   * Common label accessor for dimension values
   */
  protected labelAccessor(item: any): string {
    if (!item) return '';
    
    // Priority: name > names.vi > names.en > id
    return item.name || 
           item.names?.vi || 
           item.names?.en || 
           item.id || 
           '';
  }
  
  /**
   * Extract dimension metadata
   */
  protected extractDimension(dim: any): any {
    return {
      id: dim.id,
      name: this.labelAccessor(dim),
      values: dim.values?.map((v: any) => ({
        id: v.id,
        label: this.labelAccessor(v),
        parent: v.parent
      })) || []
    };
  }
  
  /**
   * Ensure unified output format
   * This is the CONTRACT that all parsers must follow
   */
  protected validateOutput(data: SDMXData): SDMXData {
    // Ensure required fields exist
    if (!data.dimensions) {
      throw new Error('Parser output missing dimensions');
    }
    if (!data.observations) {
      throw new Error('Parser output missing observations');
    }
    
    // Ensure observations have required fields
    data.observations.forEach((obs, index) => {
      if (obs.value === undefined) {
        console.warn(`Observation ${index} missing value`);
      }
      // Ensure each dimension has a value in observation
      data.dimensions.forEach(dim => {
        if (!(dim.id in obs)) {
          console.warn(`Observation ${index} missing dimension ${dim.id}`);
        }
      });
    });
    
    return data;
  }
}
