/**
 * Simple Table Layout Configuration Component
 * Following the design from the reference image
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Row, Col, Select, Dropdown, MenuProps } from 'antd';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  MenuOutlined,
  AppstoreOutlined,
  MoreOutlined,
  TableOutlined,
  UnorderedListOutlined,
  GroupOutlined,
} from '@ant-design/icons';
import { TableLayout, LayoutItem } from '../../types';

const { Text, Title } = Typography;

// Draggable Item Component
interface DraggableItemProps {
  id: string;
  item: LayoutItem;
  zone: 'columns' | 'sections' | 'rows';
  showSortOrder?: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, item, zone, showSortOrder }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const menuItems: MenuProps['items'] = [
    { key: 'remove', label: 'Remove' },
    { key: 'duplicate', label: 'Duplicate' },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="draggable-item"
      {...attributes}
      {...listeners}
    >
      <Card
        size="small"
        style={{
          marginBottom: 8,
          cursor: 'move',
        }}
        bodyStyle={{ 
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Space>
          <Text>{item.name || item.id}</Text>
          {item.count > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.count} values
            </Text>
          )}
        </Space>
        
        <Space>
          {showSortOrder && zone === 'columns' && (
            <>
              <Select
                size="small"
                defaultValue="ASC"
                style={{ width: 60 }}
                options={[
                  { value: 'ASC', label: 'ASC' },
                  { value: 'DESC', label: 'DESC' },
                ]}
              />
              <AppstoreOutlined />
            </>
          )}
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              style={{ color: '#1890ff' }}
            />
          </Dropdown>
        </Space>
      </Card>
    </div>
  );
};

// Zone Component
interface ZoneProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  allItems: LayoutItem[];
  zone: 'columns' | 'sections' | 'rows';
}

const Zone: React.FC<ZoneProps> = ({
  title,
  icon,
  items,
  allItems,
  zone,
}) => {
  const droppableId = `zone-${zone}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  const zoneItems = items
    .map(id => allItems.find(item => item.id === id))
    .filter(Boolean) as LayoutItem[];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        {icon}
        <Text strong>{title}</Text>
      </div>
      
      <div
        ref={setNodeRef}
        style={{
          minHeight: 100,
          background: isOver ? '#e6f7ff' : '#fafafa',
          border: `2px ${isOver ? 'solid' : 'dashed'} ${isOver ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: 4,
          padding: 12,
          transition: 'all 0.2s',
        }}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {zoneItems.length > 0 ? (
            zoneItems.map(item => (
              <DraggableItem
                key={item.id}
                id={item.id}
                item={item}
                zone={zone}
                showSortOrder={zone === 'columns'}
              />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 20,
              color: '#999',
            }}>
              Drop items here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

// Main Component
interface TableLayoutSimpleProps {
  items: LayoutItem[];
  layout: TableLayout;
  onChange: (layout: TableLayout) => void;
  onApply?: () => void;
  onCancel?: () => void;
  previewComponent?: React.ReactNode;
}

export const TableLayoutSimple: React.FC<TableLayoutSimpleProps> = ({
  items,
  layout: initialLayout,
  onChange,
  onApply,
  onCancel,
  previewComponent,
}) => {
  // Initialize with all items distributed to appropriate zones if initial layout is empty
  const initializeLayout = () => {
    if (!initialLayout || 
        (initialLayout.header.length === 0 && 
         initialLayout.sections.length === 0 && 
         initialLayout.rows.length === 0)) {
      // Default distribution: first item to columns, rest to rows
      const itemIds = items.map(item => item.id);
      return {
        header: itemIds.slice(0, 1),
        sections: [],
        rows: itemIds.slice(1),
      };
    }
    return initialLayout;
  };

  const [currentLayout, setCurrentLayout] = useState<TableLayout>(initializeLayout());
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const changed = JSON.stringify(currentLayout) !== JSON.stringify(initializeLayout());
    setHasChanges(changed);
    onChange(currentLayout);
  }, [currentLayout]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find source zone
    let sourceZone: 'header' | 'sections' | 'rows' | null = null;
    
    if (currentLayout.header.includes(activeId)) sourceZone = 'header';
    else if (currentLayout.sections.includes(activeId)) sourceZone = 'sections';
    else if (currentLayout.rows.includes(activeId)) sourceZone = 'rows';
    
    // Determine destination zone
    let destZone: 'header' | 'sections' | 'rows' | null = null;
    
    if (overId.startsWith('zone-')) {
      // Dropped on empty zone
      if (overId === 'zone-columns') destZone = 'header';
      else if (overId === 'zone-sections') destZone = 'sections';
      else if (overId === 'zone-rows') destZone = 'rows';
    } else {
      // Dropped on an item - find which zone it's in
      if (currentLayout.header.includes(overId)) destZone = 'header';
      else if (currentLayout.sections.includes(overId)) destZone = 'sections';
      else if (currentLayout.rows.includes(overId)) destZone = 'rows';
    }
    
    if (!sourceZone || !destZone) {
      setActiveId(null);
      return;
    }
    
    const newLayout = { ...currentLayout };
    
    if (sourceZone === destZone) {
      // Reorder within same zone
      const oldIndex = newLayout[sourceZone].indexOf(activeId);
      const newIndex = newLayout[sourceZone].indexOf(overId);
      
      if (newIndex !== -1) {
        newLayout[sourceZone] = arrayMove(newLayout[sourceZone], oldIndex, newIndex);
      }
    } else {
      // Move between zones
      newLayout[sourceZone] = newLayout[sourceZone].filter(id => id !== activeId);
      
      if (overId.startsWith('zone-')) {
        // Dropped on empty zone - add to end
        newLayout[destZone].push(activeId);
      } else {
        // Dropped on an item - insert at that position
        const targetIndex = newLayout[destZone].indexOf(overId);
        if (targetIndex !== -1) {
          newLayout[destZone].splice(targetIndex, 0, activeId);
        } else {
          newLayout[destZone].push(activeId);
        }
      }
    }
    
    setCurrentLayout(newLayout);
    setActiveId(null);
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };

  const handleCancel = () => {
    setCurrentLayout(initializeLayout());
    if (onCancel) {
      onCancel();
    }
  };

  const activeItem = activeId 
    ? items.find(item => item.id === activeId)
    : null;

  return (
    <div style={{ padding: 16 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Drag dimensions between columns, row sections and rows
        </Text>
        
        <Row gutter={24}>
          {/* Left side - Drag zones */}
          <Col span={10}>
            <Zone
              title="Columns"
              icon={<TableOutlined />}
              items={currentLayout.header}
              allItems={items}
              zone="columns"
            />
            
            <Zone
              title="Row Sections"
              icon={<GroupOutlined />}
              items={currentLayout.sections}
              allItems={items}
              zone="sections"
            />
            
            <Zone
              title="Rows"
              icon={<UnorderedListOutlined />}
              items={currentLayout.rows}
              allItems={items}
              zone="rows"
            />
          </Col>
          
          {/* Right side - Preview */}
          <Col span={14}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <TableOutlined />
              <Text strong>Table preview</Text>
            </div>
            
            {previewComponent || (
              <Card style={{ minHeight: 400 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 350,
                  color: '#999',
                }}>
                  Table Preview
                </div>
              </Card>
            )}
          </Col>
        </Row>
        
        {/* Action buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid #f0f0f0',
        }}>
          <Button onClick={handleCancel}>
            Cancel changes
          </Button>
          <Button
            type="primary"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            Apply layout
          </Button>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem && (
            <Card
              size="small"
              style={{
                cursor: 'grabbing',
                opacity: 0.8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              bodyStyle={{ padding: '8px 12px' }}
            >
              <Text>{activeItem.name || activeItem.id}</Text>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TableLayoutSimple;
