/**
 * SDMX-JSON 2.0/2.1 Parser (SDMX 3.0/3.1 standard)
 * Placeholder for future implementation
 */

import { SDMXData } from '../types';
import { BaseSDMXParser, SDMXVersion } from './sdmx-parser-base';

/**
 * Parser for SDMX-JSON 2.0+ format
 * This format supports:
 * - Direct dimension IDs instead of indices
 * - Multiple data formats (flat, time-series, cross-sectional)
 * - Inline metadata
 * - More flexible observation structure
 */
export class SDMXJSONV2Parser extends BaseSDMXParser {
  version = SDMXVersion.V2_0;
  
  canParse(data: any): boolean {
    // Check for v2 characteristics
    return !!(
      data.meta?.schema || 
      data.data || 
      (data.structure && !data.structures)
    );
  }
  
  parse(data: any, locale: string = 'en'): SDMXData {
    // TODO: Implement v2 parsing logic
    // This is a placeholder that will be implemented when v2 data is available
    
    console.warn('SDMX-JSON v2 parser not yet fully implemented, using basic structure');
    
    // Basic structure extraction for v2
    const result: SDMXData = {
      dimensions: [],
      observations: [],
      attributes: []
    };
    
    // Extract dimensions from structure/meta
    if (data.structure?.dimensions) {
      result.dimensions = this.extractDimensionsV2(data.structure.dimensions, locale);
    } else if (data.meta?.dimensions) {
      result.dimensions = this.extractDimensionsV2(data.meta.dimensions, locale);
    }
    
    // Extract observations from data
    if (data.data) {
      result.observations = this.extractObservationsV2(data.data, result.dimensions);
    }
    
    return this.validateOutput(result);
  }
  
  private extractDimensionsV2(dimensions: any, locale: string = 'en'): any[] {
    const result: any[] = [];
    
    // V2 can have dimensions as object or array
    if (Array.isArray(dimensions)) {
      dimensions.forEach(dim => {
        result.push(this.extractDimension(dim));
      });
    } else if (typeof dimensions === 'object') {
      // Handle dimensions grouped by type
      ['dataSet', 'series', 'observation'].forEach(type => {
        if (dimensions[type]) {
          dimensions[type].forEach((dim: any) => {
            result.push(this.extractDimension(dim));
          });
        }
      });
    }
    
    return result;
  }
  
  private extractObservationsV2(data: any, dimensions: any[]): any[] {
    const observations: any[] = [];
    
    // V2 format varies based on data format type
    // This is a simplified extraction
    if (Array.isArray(data)) {
      // Flat format
      data.forEach(obs => {
        observations.push(this.parseObservationV2(obs, dimensions));
      });
    } else if (data.series) {
      // Time-series format
      Object.entries(data.series).forEach(([key, series]: [string, any]) => {
        if (series.observations) {
          Object.entries(series.observations).forEach(([obsKey, obsValue]: [string, any]) => {
            const obs = this.parseObservationV2(obsValue, dimensions);
            // Add series dimensions to observation
            this.addSeriesDimensionsToObs(obs, key, dimensions);
            observations.push(obs);
          });
        }
      });
    } else if (data.observations) {
      // Direct observations
      Object.entries(data.observations).forEach(([key, value]: [string, any]) => {
        observations.push(this.parseObservationV2(value, dimensions));
      });
    }
    
    return observations;
  }
  
  private parseObservationV2(obs: any, dimensions: any[]): any {
    const result: any = {};
    
    // V2 observation can be:
    // - Simple value (number/string)
    // - Object with value and attributes
    // - Array [value, attributes...]
    
    if (typeof obs === 'object' && !Array.isArray(obs)) {
      // Object format
      result.value = obs.value ?? obs.OBS_VALUE;
      
      // Copy dimension values
      dimensions.forEach(dim => {
        if (obs[dim.id] !== undefined) {
          result[dim.id] = obs[dim.id];
        }
      });
      
      // Copy attributes
      if (obs.attributes) {
        result._attributes = obs.attributes;
      }
      if (obs.annotations) {
        result._annotations = obs.annotations;
      }
    } else if (Array.isArray(obs)) {
      // Array format (similar to v1)
      result.value = obs[0];
      // Additional elements are attributes
      if (obs.length > 1) {
        result._attributeValues = obs.slice(1);
      }
    } else {
      // Simple value
      result.value = obs;
    }
    
    return result;
  }
  
  private addSeriesDimensionsToObs(obs: any, seriesKey: string, dimensions: any[]): void {
    // Parse series key to add dimension values
    // V2 series key can be:
    // - Colon-separated indices (like v1)
    // - Dot-separated IDs
    // - Direct dimension=value format
    
    if (seriesKey.includes(':')) {
      // Index format (backward compatible)
      const indices = seriesKey.split(':').map(Number);
      dimensions.forEach((dim, idx) => {
        if (indices[idx] !== undefined && dim.values?.[indices[idx]]) {
          obs[dim.id] = dim.values[indices[idx]].id;
        }
      });
    } else if (seriesKey.includes('.')) {
      // ID format
      const ids = seriesKey.split('.');
      dimensions.forEach((dim, idx) => {
        if (ids[idx]) {
          obs[dim.id] = ids[idx];
        }
      });
    }
    // Add more formats as needed
  }
}

// Export singleton instance for convenience
export const sdmxV2Parser = new SDMXJSONV2Parser();

// Export parse function for backward compatibility
export function parseSDMXJSONV2(data: any, locale: string = 'en'): SDMXData {
  return sdmxV2Parser.parse(data, locale);
}
