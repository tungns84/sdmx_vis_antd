/**
 * Parser for SDMX-JSON format to internal SDMXData format
 */

import { SDMXData } from '../types';

export interface SDMXJSONData {
  dataSets: Array<{
    series: Record<string, {
      attributes?: any[];
      observations: Record<string, any[]>;
    }>;
  }>;
  structures: Array<{
    dimensions: {
      series?: any[];
      observation?: any[];
    };
    attributes?: any;
  }>;
}

/**
 * Parse SDMX-JSON format to internal SDMXData format
 */
export function parseSDMXJSON(data: SDMXJSONData): SDMXData {
  if (!data?.structures?.[0] || !data?.dataSets?.[0]) {
    throw new Error('Invalid SDMX-JSON format');
  }

  const structure = data.structures[0];
  const dataSet = data.dataSets[0];
  
  // Parse dimensions
  const dimensions: any[] = [];
  
  // Add series dimensions
  if (structure.dimensions.series) {
    structure.dimensions.series.forEach((dim: any) => {
      dimensions.push({
        id: dim.id,
        name: dim.name || dim.names?.vi || dim.names?.en || dim.id,
        values: dim.values?.map((v: any) => ({
          id: v.id,
          name: v.name || v.names?.vi || v.names?.en || v.id,
          order: v.order,
          parent: v.parent
        })) || []
      });
    });
  }
  
  // Add observation dimensions (usually TIME_PERIOD)
  if (structure.dimensions.observation) {
    structure.dimensions.observation.forEach((dim: any) => {
      dimensions.push({
        id: dim.id,
        name: dim.name || dim.names?.vi || dim.names?.en || dim.id,
        values: dim.values?.map((v: any) => ({
          id: v.id,
          name: v.name || v.names?.vi || v.names?.en || v.id,
          start: v.start,
          end: v.end
        })) || []
      });
    });
  }
  
  // Parse observations
  const observations: any[] = [];
  
  // Get dimension positions
  const seriesDims = structure.dimensions.series || [];
  const obsDims = structure.dimensions.observation || [];
  
  console.log('Series dimensions:', seriesDims.map((d: any) => d.id));
  console.log('Observation dimensions:', obsDims.map((d: any) => d.id));
  
  // Process each series
  Object.entries(dataSet.series).forEach(([seriesKey, seriesData]) => {
    const seriesIndices = seriesKey.split(':').map(k => parseInt(k));
    
    // Debug log
    console.log('Processing series:', seriesKey, 'indices:', seriesIndices);
    
    // Process each observation in the series
    Object.entries(seriesData.observations).forEach(([obsKey, obsValue]) => {
      const obs: any = {
        value: obsValue[0] // First element is the value
      };
      
      // Map series dimensions using indices
      seriesDims.forEach((dim: any, idx: number) => {
        const valueIndex = seriesIndices[idx];
        if (!isNaN(valueIndex) && dim.values?.[valueIndex]) {
          const dimValue = dim.values[valueIndex];
          obs[dim.id] = dimValue.id;
          
          // Debug first few observations
          if (observations.length < 3) {
            console.log(`  ${dim.id} [index ${valueIndex}] = ${dimValue.id} (${dimValue.name})`);
          }
        }
      });
      
      // Map observation dimensions (TIME_PERIOD)
      obsDims.forEach((dim: any) => {
        const obsIndex = parseInt(obsKey);
        if (!isNaN(obsIndex) && dim.values?.[obsIndex]) {
          const dimValue = dim.values[obsIndex];
          obs[dim.id] = dimValue.id;
          
          // Debug first few observations
          if (observations.length < 3) {
            console.log(`  ${dim.id} [index ${obsIndex}] = ${dimValue.id}`);
          }
        }
      });
      
      // Extract UNIT from dimensions if present
      if (obs.UNIT) {
        const unitDim = seriesDims.find((d: any) => d.id === 'UNIT');
        if (unitDim) {
          const unitValue = unitDim.values?.find((v: any) => v.id === obs.UNIT);
          if (unitValue) {
            obs.UNIT_MEASURE = unitValue.name || unitValue.id;
          }
        }
      }
      
      // Add attributes if available
      if (obsValue.length > 1) {
        // Additional elements might contain flags, status, etc.
        for (let i = 1; i < obsValue.length; i++) {
          if (obsValue[i] !== null) {
            obs[`ATTR_${i}`] = obsValue[i];
          }
        }
      }
      
      // Only add observations with actual values
      if (obs.value !== null && obs.value !== undefined && obs.value !== '') {
        observations.push(obs);
      }
    });
  });
  
  console.log(`Parsed ${observations.length} observations`);
  console.log('Sample observation:', observations[0]);
  
  // Get attributes from structure
  const attributes: any[] = [];
  if (structure.attributes) {
    // Process series attributes
    if (structure.attributes.series) {
      structure.attributes.series.forEach((attr: any) => {
        attributes.push({
          id: attr.id,
          name: attr.name || attr.names?.vi || attr.names?.en || attr.id,
          roles: attr.roles
        });
      });
    }
    
    // Process observation attributes
    if (structure.attributes.observation) {
      structure.attributes.observation.forEach((attr: any) => {
        attributes.push({
          id: attr.id,
          name: attr.name || attr.names?.vi || attr.names?.en || attr.id,
          roles: attr.roles
        });
      });
    }
  }
  
  return {
    dimensions,
    observations,
    attributes
  };
}

/**
 * Get default layout based on dimensions
 */
export function getDefaultLayout(data: SDMXData) {
  const timeDim = data.dimensions.find(d => 
    d.id === 'TIME_PERIOD' || 
    d.id === 'TIME' || 
    d.id.includes('TIME')
  );
  
  const areaDim = data.dimensions.find(d => 
    d.id === 'REF_AREA' || 
    d.id === 'AREA' || 
    d.id.includes('AREA')
  );
  
  const indicatorDim = data.dimensions.find(d => 
    d.id === 'INDICATOR' || 
    d.id.includes('INDICATOR')
  );
  
  const urbanDim = data.dimensions.find(d => 
    d.id === 'URBANIZATION' || 
    d.id.includes('URBAN')
  );
  
  const unitDim = data.dimensions.find(d =>
    d.id === 'UNIT' ||
    d.id.includes('UNIT')
  );
  
  // Filter out dimensions that shouldn't be visible
  const ignoredDims = ['FREQ', 'OBS_STATUS', 'INSURANCE_TYPE', 'MARRIAGE', 'SEX'];
  
  const otherDims = data.dimensions.filter(d => 
    d !== timeDim && 
    d !== areaDim && 
    d !== indicatorDim &&
    d !== urbanDim &&
    d !== unitDim &&
    !ignoredDims.includes(d.id) &&
    // Only include dimensions with actual values
    d.values && d.values.length > 0 &&
    // Exclude dimensions where all values are "_Z" (not applicable)
    !d.values.every((v: any) => v.id === '_Z')
  );
  
  // Default layout configuration
  const layout = {
    header: [] as string[],
    rows: [] as string[],
    sections: [] as string[]
  };
  
  // Time usually go in columns
  if (timeDim) {
    layout.header.push(timeDim.id);
  }
  
  // Indicator can go in columns if we have time
  if (indicatorDim && timeDim) {
    layout.header.push(indicatorDim.id);
  }
  
  // Area usually in rows
  if (areaDim) {
    layout.rows.push(areaDim.id);
  }
  
  // Urban/Rural can go in rows
  if (urbanDim && urbanDim.values && urbanDim.values.length > 1) {
    layout.rows.push(urbanDim.id);
  }
  
  // Unit typically goes in rows if it has multiple values
  if (unitDim && unitDim.values && unitDim.values.length > 1) {
    // Don't add UNIT to layout if it's mainly for display
    // layout.rows.push(unitDim.id);
  }
  
  // If indicator not in header and we have it, add to rows
  if (indicatorDim && !layout.header.includes(indicatorDim.id)) {
    layout.rows.push(indicatorDim.id);
  }
  
  // Add other dimensions to rows if not too many
  otherDims.forEach(dim => {
    if (layout.rows.length < 3) {
      layout.rows.push(dim.id);
    }
  });
  
  console.log('Generated default layout:', layout);
  
  return layout;
}