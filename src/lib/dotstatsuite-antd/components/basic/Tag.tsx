import React from 'react';
import { Tag as AntTag, TagProps as AntTagProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface TagProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  onDelete?: () => void;
  color?: string;
  variant?: 'default' | 'outlined';
  size?: 'small' | 'default' | 'large';
  icon?: React.ReactNode;
  closable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Tag: React.FC<TagProps> = ({
  label,
  children,
  onDelete,
  color,
  variant = 'default',
  size = 'default',
  icon,
  closable,
  className,
  style,
}) => {
  const antTagProps: AntTagProps = {
    color,
    closable: closable ?? !!onDelete,
    onClose: onDelete,
    className,
    style: {
      ...style,
      fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
      padding: size === 'small' ? '0 7px' : size === 'large' ? '4px 15px' : '0 7px',
    },
    closeIcon: onDelete ? <CloseOutlined /> : undefined,
    bordered: variant === 'outlined',
    icon,
  };

  return (
    <AntTag {...antTagProps}>
      {label || children}
    </AntTag>
  );
};

export default Tag;
