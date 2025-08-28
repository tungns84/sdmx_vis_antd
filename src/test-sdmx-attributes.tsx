/**
 * Test page for SDMX Attributes and Annotations
 */

import React, { useEffect, useState } from 'react';
import { getDefaultLayout } from './lib/dotstatsuite-antd/utils/sdmx-json-parser';
import { parseSDMX, SDMXVersion } from './lib/dotstatsuite-antd/utils/sdmx-parser-factory';
import SDMXTableAutoFreeze from './lib/dotstatsuite-antd/components/table/SDMXTableAutoFreeze';
import { SDMXData, TableLayout } from './lib/dotstatsuite-antd/types';

// Create sample data with attributes and flags
const createTestData = () => {
  return {
    "meta": {
      "structure": [
        {
          "dimensions": {
            "dataset": [],
            "series": [
              {
                "id": "COUNTRY",
                "name": "Country",
                "values": [
                  { "id": "FR", "name": "France" },
                  { "id": "DE", "name": "Germany" },
                  { "id": "IT", "name": "Italy" }
                ]
              },
              {
                "id": "INDICATOR",
                "name": "Indicator",
                "values": [
                  { "id": "GDP", "name": "GDP Growth" },
                  { "id": "INFL", "name": "Inflation" }
                ]
              }
            ],
            "observation": [
              {
                "id": "TIME_PERIOD",
                "name": "Time Period",
                "values": [
                  { "id": "2021", "name": "2021" },
                  { "id": "2022", "name": "2022" },
                  { "id": "2023", "name": "2023" }
                ]
              }
            ]
          },
          "attributes": {
            "series": [
              {
                "id": "UNIT_MEASURE",
                "name": "Unit of Measure",
                "values": [
                  { "id": "PCT", "name": "Percent" },
                  { "id": "EUR", "name": "Euro" }
                ]
              }
            ],
            "observation": [
              {
                "id": "OBS_STATUS",
                "name": "Observation Status",
                "values": [
                  { "id": "A", "name": "Normal" },
                  { "id": "P", "name": "Provisional" },
                  { "id": "E", "name": "Estimated" },
                  { "id": "C", "name": "Confidential" },
                  { "id": "M", "name": "Missing" }
                ]
              },
              {
                "id": "DECIMALS",
                "name": "Decimals"
              },
              {
                "id": "OBS_COMMENT",
                "name": "Comment"
              }
            ]
          }
        }
      ]
    },
    "dataSets": [
      {
        "series": {
          // France GDP
          "0:0": {
            "attributes": [0], // PCT
            "observations": {
              "0": [3.5, 0, 2], // 2021: Normal, 2 decimals
              "1": [2.8, 1, 2, "Early estimate"], // 2022: Provisional, 2 decimals, comment
              "2": [1.9, 2, 2] // 2023: Estimated
            }
          },
          // Germany GDP
          "1:0": {
            "attributes": [0],
            "observations": {
              "0": [4.2, 0, 2],
              "1": [3.1, 0, 2],
              "2": [null, 4] // 2023: Missing
            }
          },
          // Italy GDP
          "2:0": {
            "attributes": [0],
            "observations": {
              "0": [3.0, 0, 2],
              "1": [null, 3], // 2022: Confidential
              "2": [2.1, 1, 2]
            }
          },
          // France Inflation
          "0:1": {
            "attributes": [0],
            "observations": {
              "0": [2.1, 0, 1],
              "1": [5.2, 0, 1],
              "2": [4.8, 1, 1]
            }
          },
          // Germany Inflation
          "1:1": {
            "attributes": [0],
            "observations": {
              "0": [3.2, 0, 1],
              "1": [7.9, 0, 1],
              "2": [6.1, 2, 1, "Subject to revision"]
            }
          },
          // Italy Inflation
          "2:1": {
            "attributes": [0],
            "observations": {
              "0": [1.9, 0, 1],
              "1": [8.7, 0, 1],
              "2": [5.9, 0, 1]
            }
          }
        }
      }
    ]
  };
};

const TestSDMXAttributes: React.FC = () => {
  const [data, setData] = useState<SDMXData | null>(null);
  const [layout, setLayout] = useState<TableLayout | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const testData = createTestData();
      const parsedData = parseSDMX(testData, SDMXVersion.AUTO);
      const defaultLayout = getDefaultLayout(parsedData);
      
      // Adjust layout for better display
      const customLayout: TableLayout = {
        header: ['TIME_PERIOD'],
        rows: ['COUNTRY', 'INDICATOR'],
        sections: []
      };
      
      setData(parsedData);
      setLayout(customLayout);
    } catch (error) {
      console.error('Error parsing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>SDMX Attributes and Annotations Test</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h3>Legend:</h3>
        <ul>
          <li><strong>p</strong> - Provisional data</li>
          <li><strong>e</strong> - Estimated data</li>
          <li><strong>c</strong> - Confidential data</li>
          <li><strong>..</strong> - Missing data</li>
          <li><strong>*</strong> - Has comment/annotation</li>
        </ul>
      </div>

      {loading && <div>Loading...</div>}
      
      {data && layout && (
        <div style={{ overflowX: 'auto' }}>
          <SDMXTableAutoFreeze
            data={data}
            layout={layout}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default TestSDMXAttributes;
