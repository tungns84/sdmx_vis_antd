import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TsDemoPage from './ts-demo';

// Mock the API
jest.mock('../api/sdmx/mock', () => ({
  fetchSdmxSample: jest.fn(() => 
    Promise.resolve({
      dataSets: [{
        series: {
          '0:0:0:0:0:0:0:0:0': {
            observations: {
              '0': ['11'],
              '1': ['112024'],
              '2': ['112024'],
              '3': ['112024'],
              '4': ['112024']
            }
          }
        }
      }],
      structures: [{
        dimensions: {
          observation: [{
            values: [
              { id: '2023' },
              { id: '2024' },
              { id: '2025' },
              { id: '2026' },
              { id: '2027' }
            ]
          }]
        }
      }]
    })
  )
}));

describe('TsDemoPage', () => {
  it('renders the title', () => {
    render(<TsDemoPage />);
    expect(screen.getByText(/SDMX Demo/)).toBeInTheDocument();
  });

  it('loads and displays data in table', async () => {
    render(<TsDemoPage />);
    
    await waitFor(() => {
      expect(screen.getByText('0:0:0:0:0:0:0:0:0')).toBeInTheDocument();
    });
    
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('changes table size when segmented control is clicked', async () => {
    render(<TsDemoPage />);
    
    const smallButton = screen.getByText('Small');
    fireEvent.click(smallButton);
    
    // Table should have small size class
    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table.closest('.ant-table-small')).toBeInTheDocument();
    });
  });

  it('has working pagination', async () => {
    render(<TsDemoPage />);
    
    await waitFor(() => {
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });
  });
});
