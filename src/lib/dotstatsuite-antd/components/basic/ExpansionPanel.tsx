import React from 'react';
import { Collapse, CollapseProps } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

interface ExpansionPanelProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
  extra?: React.ReactNode;
  className?: string;
  collapsible?: 'header' | 'disabled' | 'icon';
  showArrow?: boolean;
}

const ExpansionPanel: React.FC<ExpansionPanelProps> = ({
  title,
  children,
  defaultExpanded = false,
  expanded,
  onChange,
  disabled = false,
  extra,
  className,
  collapsible = 'header',
  showArrow = true,
}) => {
  const isControlled = expanded !== undefined;
  
  const handleChange = (keys: string | string[]) => {
    if (onChange) {
      const isExpanded = Array.isArray(keys) ? keys.includes('1') : keys === '1';
      onChange(isExpanded);
    }
  };

  const collapseProps: CollapseProps = {
    className,
    onChange: handleChange,
    expandIcon: showArrow ? ({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} /> : undefined,
    expandIconPosition: 'start',
    bordered: false,
  };

  if (isControlled) {
    collapseProps.activeKey = expanded ? ['1'] : [];
  } else {
    collapseProps.defaultActiveKey = defaultExpanded ? ['1'] : [];
  }

  return (
    <Collapse {...collapseProps}>
      <Panel
        header={title}
        key="1"
        collapsible={disabled ? 'disabled' : collapsible}
        extra={extra}
      >
        {children}
      </Panel>
    </Collapse>
  );
};

export default ExpansionPanel;
