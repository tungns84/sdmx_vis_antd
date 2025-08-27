import React from 'react';
import { Card, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { changeActionId } from '../../ducks/vis';

interface PanelProps {
  children?: React.ReactNode;
  actionId?: string;
  title?: string;
}

/**
 * Panel Component
 * Container for collapsible panels in vis-tools
 * Migrated to AntD + TypeScript
 */
const Panel: React.FC<PanelProps> = ({ children, actionId, title }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    if (actionId) {
      dispatch(changeActionId(null));
    }
  };

  return (
    <Card
      size="small"
      title={title}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          size="small"
        />
      }
      style={{ margin: '8px 0' }}
    >
      {children}
    </Card>
  );
};

export default Panel;
