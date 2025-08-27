import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

/**
 * ButtonWrapper - Maps MUI Button props to AntD Button
 * Helps with gradual migration from MUI to AntD
 */

export interface ButtonWrapperProps extends Omit<AntButtonProps, 'type'> {
  // MUI-like props
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // Allow AntD type as well
  type?: AntButtonProps['type'];
}

/**
 * Maps MUI variant to AntD type
 */
const mapVariantToType = (
  variant?: string,
  color?: string
): AntButtonProps['type'] => {
  if (variant === 'contained') {
    if (color === 'secondary') return 'default';
    return 'primary';
  }
  if (variant === 'outlined') return 'default';
  if (variant === 'text') return 'link';
  return 'default';
};

/**
 * Maps MUI color to AntD danger prop
 */
const mapColorToDanger = (color?: string): boolean => {
  return color === 'error';
};

/**
 * ButtonWrapper Component
 * 
 * Usage:
 * ```tsx
 * // MUI style (works during migration)
 * <ButtonWrapper variant="contained" color="primary">Click me</ButtonWrapper>
 * 
 * // AntD style (final target)
 * <ButtonWrapper type="primary">Click me</ButtonWrapper>
 * ```
 */
const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  variant,
  color,
  fullWidth,
  startIcon,
  endIcon,
  type,
  children,
  style,
  ...restProps
}) => {
  // Determine the button type
  const buttonType = type || mapVariantToType(variant, color);
  
  // Check if it should be danger
  const isDanger = mapColorToDanger(color);
  
  // Combine icons with children
  const buttonContent = (
    <>
      {startIcon && <span style={{ marginRight: 8 }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ marginLeft: 8 }}>{endIcon}</span>}
    </>
  );
  
  // Combine styles
  const combinedStyle: React.CSSProperties = {
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  return (
    <AntButton
      type={buttonType}
      danger={isDanger}
      style={combinedStyle}
      {...restProps}
    >
      {buttonContent}
    </AntButton>
  );
};

export default ButtonWrapper;

// Re-export Button from antd for convenience
export { Button } from 'antd';

// Helper function for migrating IconButton
export const IconButton: React.FC<ButtonWrapperProps & { 'aria-label'?: string }> = ({
  children,
  ...props
}) => {
  return (
    <ButtonWrapper
      type="text"
      shape="circle"
      {...props}
    >
      {children}
    </ButtonWrapper>
  );
};
