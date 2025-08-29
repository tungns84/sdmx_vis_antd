import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Space, Typography, Alert } from 'antd';
import { SwapOutlined, ReloadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { LayoutPanelProps } from '../../../types';
import './LayoutPanel.css';

const { Title, Text } = Typography;

interface DimensionItem {
  id: string;
  name: string;
  count?: number;
}

/**
 * Layout Panel Component with i18n
 * Allows drag-and-drop configuration of table layout
 */
const LayoutPanelWithI18n: React.FC<LayoutPanelProps> = ({
  data,
  layout,
  onLayoutChange,
  onClose
}) => {
  const intl = useIntl();
  const [tempLayout, setTempLayout] = useState(layout);
  const [draggedItem, setDraggedItem] = useState<DimensionItem | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  // Create dimension items from data
  const dimensionItems = useMemo(() => {
    return data.dimensions.map(dim => ({
      id: dim.id,
      name: dim.name || dim.id,
      count: dim.values?.length || 0
    }));
  }, [data]);

  // Generate preview data
  useEffect(() => {
    if (!tempLayout.header.length && !tempLayout.rows.length) {
      setPreviewData(null);
      return;
    }

    // Create sample preview with actual dimension names
    const preview = {
      headers: tempLayout.header.map(id => {
        const dim = data.dimensions.find(d => d.id === id);
        return {
          name: dim?.name || id,
          values: dim?.values?.slice(0, 3).map(v => v.name || v.id) || []
        };
      }),
      rows: tempLayout.rows.map(id => {
        const dim = data.dimensions.find(d => d.id === id);
        return {
          name: dim?.name || id,
          values: dim?.values?.slice(0, 2).map(v => v.name || v.id) || []
        };
      }),
      sections: tempLayout.sections.map(id => {
        const dim = data.dimensions.find(d => d.id === id);
        return {
          name: dim?.name || id,
          values: dim?.values?.slice(0, 2).map(v => v.name || v.id) || []
        };
      })
    };

    setPreviewData(preview);
  }, [tempLayout, data]);

  // Drag handlers
  const handleDragStart = (item: DimensionItem, from: string) => {
    setDraggedItem(item);
    setDraggedFrom(from);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, to: string) => {
    e.preventDefault();
    if (!draggedItem || !draggedFrom) return;

    const newLayout = { ...tempLayout };

    // Remove from source
    if (draggedFrom === 'header') {
      newLayout.header = newLayout.header.filter(id => id !== draggedItem.id);
    } else if (draggedFrom === 'rows') {
      newLayout.rows = newLayout.rows.filter(id => id !== draggedItem.id);
    } else if (draggedFrom === 'sections') {
      newLayout.sections = newLayout.sections.filter(id => id !== draggedItem.id);
    }

    // Add to target
    if (to === 'header') {
      newLayout.header.push(draggedItem.id);
    } else if (to === 'rows') {
      newLayout.rows.push(draggedItem.id);
    } else if (to === 'sections') {
      newLayout.sections.push(draggedItem.id);
    }

    setTempLayout(newLayout);
    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const handleReset = () => {
    setTempLayout(layout);
  };

  const handleApply = () => {
    onLayoutChange(tempLayout);
    onClose();
  };

  // Render dimension list
  const renderDimensionList = (dimensions: string[], zone: string) => {
    return (
      <div
        className={`layout-drop-zone ${draggedItem ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, zone)}
      >
        {dimensions.map(id => {
          const item = dimensionItems.find(d => d.id === id);
          if (!item) return null;
          
          return (
            <div
              key={id}
              className="layout-dimension-item"
              draggable
              onDragStart={() => handleDragStart(item, zone)}
            >
              <span className="dimension-name">{item.name}</span>
              {item.count && (
                <span className="dimension-count">({item.count})</span>
              )}
            </div>
          );
        })}
        {dimensions.length === 0 && (
          <div className="layout-drop-hint">
            <FormattedMessage id="layout.drag.hint" />
          </div>
        )}
      </div>
    );
  };

  // Render table preview
  const renderTablePreview = () => {
    if (!previewData) {
      return (
        <div className="preview-empty">
          <FormattedMessage id="layout.preview.empty" />
        </div>
      );
    }

    return (
      <div className="preview-table-container">
        <table className="preview-table">
          <thead>
            {/* Column headers */}
            {previewData.headers.map((header: any, idx: number) => (
              <tr key={`header-${idx}`}>
                <th className="preview-dim-name" 
                    colSpan={previewData.rows.length + previewData.sections.length + 2}>
                  {header.name}
                </th>
                {header.values.map((val: string, vIdx: number) => (
                  <th key={`h-${idx}-${vIdx}`} className="preview-dim-value">
                    {val}
                  </th>
                ))}
              </tr>
            ))}
            {/* Row headers */}
            {previewData.headers.length > 0 && previewData.rows.length > 0 && (
              <tr>
                {previewData.sections.map((section: any) => (
                  <th key={`s-${section.name}`} className="preview-row-name">
                    {section.name}
                  </th>
                ))}
                {previewData.rows.map((row: any) => (
                  <th key={`r-${row.name}`} className="preview-row-name">
                    {row.name}
                  </th>
                ))}
                <th className="preview-row-name">
                  <FormattedMessage id="table.unit" />
                </th>
                <th className="preview-row-name"></th>
                {/* Empty cells for data columns */}
                {previewData.headers[0]?.values.map((_: any, idx: number) => (
                  <th key={`empty-${idx}`} className="preview-empty-cell"></th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {/* Sample data rows */}
            {[0, 1, 2].map(rowIdx => (
              <tr key={`data-${rowIdx}`}>
                {previewData.sections.map((section: any, sIdx: number) => (
                  sIdx === 0 && rowIdx === 0 ? (
                    <td key={`s-val`} className="preview-section" 
                        rowSpan={3}
                        colSpan={previewData.sections.length}>
                      {section.values[0]}
                    </td>
                  ) : null
                ))}
                {previewData.rows.map((row: any, rIdx: number) => (
                  <td key={`r-val-${rIdx}`} className="preview-row-value">
                    {row.values[rowIdx % row.values.length]}
                  </td>
                ))}
                <td className="preview-unit">USD</td>
                <td className="preview-symbol">P</td>
                {previewData.headers[0]?.values.map((_: any, idx: number) => (
                  <td key={`data-${idx}`} className="preview-data">
                    {Math.floor(Math.random() * 1000)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          <FormattedMessage id="layout.title" />
        </Space>
      }
      open={true}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="reset" icon={<ReloadOutlined />} onClick={handleReset}>
          <FormattedMessage id="layout.reset" />
        </Button>,
        <Button key="cancel" onClick={onClose}>
          <FormattedMessage id="layout.cancel" />
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          <FormattedMessage id="layout.apply" />
        </Button>
      ]}
    >
      <div className="layout-panel-content">
        <div className="layout-zones">
          <div className="layout-zone">
            <Title level={5}>
              <FormattedMessage id="layout.columns" />
            </Title>
            {renderDimensionList(tempLayout.header, 'header')}
          </div>
          
          <div className="layout-zone">
            <Title level={5}>
              <FormattedMessage id="layout.rows" />
            </Title>
            {renderDimensionList(tempLayout.rows, 'rows')}
          </div>
          
          <div className="layout-zone">
            <Title level={5}>
              <FormattedMessage id="layout.sections" />
            </Title>
            {renderDimensionList(tempLayout.sections, 'sections')}
          </div>
        </div>

        <div className="layout-preview">
          <Title level={5}>
            <FormattedMessage id="layout.preview" />
          </Title>
          {renderTablePreview()}
        </div>
      </div>
    </Modal>
  );
};

export default LayoutPanelWithI18n;
