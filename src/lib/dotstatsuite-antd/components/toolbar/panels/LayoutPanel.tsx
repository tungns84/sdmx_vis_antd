/**
 * Layout Configuration Panel
 * Following react rule: Keep components small and focused
 */

import React, { memo, useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { TableLayoutSimple } from '../../layout/TableLayoutSimple';
import { TablePreview } from '../../table/TablePreview';
import { TableLayout } from '../../../types';
import { SDMXData } from '../../../types';

interface LayoutPanelProps {
  data: SDMXData;
  currentLayout: TableLayout;
  onLayoutChange: (layout: TableLayout) => void;
  onClose: () => void;
}

/**
 * Layout Configuration Panel
 * Allows users to reorganize table dimensions via drag-and-drop
 */
export const LayoutPanel: React.FC<LayoutPanelProps> = memo(({
  data,
  currentLayout,
  onLayoutChange,
  onClose,
}) => {
  const [tempLayout, setTempLayout] = useState<TableLayout>(currentLayout);
  const [visible, setVisible] = useState(true);

  // Get layout items from data dimensions
  const layoutItems = data.dimensions.map(dim => ({
    id: dim.id,
    name: dim.name,
    type: 'dimension' as const,
    count: dim.values.length,
  }));

  // Handle layout change
  const handleLayoutChange = useCallback((newLayout: TableLayout) => {
    setTempLayout(newLayout);
  }, []);

  // Apply changes
  const handleApply = useCallback(() => {
    onLayoutChange(tempLayout);
    message.success('Layout updated successfully');
    setVisible(false);
    onClose();
  }, [tempLayout, onLayoutChange, onClose]);

  // Cancel changes
  const handleCancel = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  // Create preview component
  const previewComponent = (
    <TablePreview
      layout={tempLayout}
      items={layoutItems}
      maxRows={3}
      maxCols={9}
    />
  );

  return (
    <Modal
      title="Table Layout Configuration"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      style={{ top: 20 }}
      destroyOnClose
    >
      <TableLayoutSimple
        items={layoutItems}
        layout={currentLayout}
        onChange={handleLayoutChange}
        onApply={handleApply}
        onCancel={handleCancel}
        previewComponent={previewComponent}
      />
    </Modal>
  );
});

LayoutPanel.displayName = 'LayoutPanel';
