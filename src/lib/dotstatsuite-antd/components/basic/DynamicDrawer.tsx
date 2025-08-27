import React from 'react';
import { Drawer, DrawerProps } from 'antd';

interface DynamicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  children?: React.ReactNode;
  title?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  destroyOnClose?: boolean;
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  className?: string;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

const DynamicDrawer: React.FC<DynamicDrawerProps> = ({
  open = false,
  onClose,
  anchor = 'right',
  children,
  title,
  width = 378,
  height = 378,
  closable = true,
  destroyOnClose = false,
  footer,
  extra,
  mask = true,
  maskClosable = true,
  className,
  bodyStyle,
  headerStyle,
}) => {
  // Map anchor to placement
  const placementMap = {
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom',
  } as const;

  const drawerProps: DrawerProps = {
    open,
    onClose,
    placement: placementMap[anchor],
    title,
    closable,
    destroyOnClose,
    footer,
    extra,
    mask,
    maskClosable,
    className,
    bodyStyle,
    headerStyle,
  };

  // Set width or height based on placement
  if (anchor === 'left' || anchor === 'right') {
    drawerProps.width = width;
  } else {
    drawerProps.height = height;
  }

  return (
    <Drawer {...drawerProps}>
      {children}
    </Drawer>
  );
};

export default DynamicDrawer;
