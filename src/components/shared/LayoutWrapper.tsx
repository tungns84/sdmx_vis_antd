import React from 'react';
import { Row, Col, Space, Layout } from 'antd';
import type { RowProps, ColProps, SpaceProps } from 'antd';

/**
 * LayoutWrapper - Maps MUI Grid/Container/Box to AntD Layout components
 */

// Grid Container props mapping
export interface GridContainerProps extends Omit<RowProps, 'children'> {
  container?: boolean;
  spacing?: number;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  children?: React.ReactNode;
}

// Grid Item props mapping
export interface GridItemProps extends Omit<ColProps, 'children'> {
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  children?: React.ReactNode;
}

// Combined Grid props
export type GridProps = GridContainerProps & GridItemProps;

/**
 * Converts MUI Grid spacing (0-10) to AntD gutter
 * MUI: spacing * 8px
 * AntD: direct pixel value
 */
const convertSpacing = (spacing?: number): number => {
  return spacing ? spacing * 8 : 0;
};

/**
 * Converts MUI 12-column to AntD 24-column system
 */
const convertColumns = (muiCols?: number | boolean): number | undefined => {
  if (typeof muiCols === 'boolean') {
    return muiCols ? 24 : undefined;
  }
  if (typeof muiCols === 'number') {
    return Math.round((muiCols / 12) * 24);
  }
  return undefined;
};

/**
 * Maps MUI flex props to AntD
 */
const mapFlexProps = (
  direction?: string,
  justifyContent?: string,
  alignItems?: string
): { justify?: RowProps['justify']; align?: RowProps['align'] } => {
  const props: { justify?: RowProps['justify']; align?: RowProps['align'] } = {};
  
  // Map justifyContent
  switch (justifyContent) {
    case 'flex-start':
      props.justify = 'start';
      break;
    case 'flex-end':
      props.justify = 'end';
      break;
    case 'center':
      props.justify = 'center';
      break;
    case 'space-between':
      props.justify = 'space-between';
      break;
    case 'space-around':
      props.justify = 'space-around';
      break;
    case 'space-evenly':
      props.justify = 'space-evenly';
      break;
  }
  
  // Map alignItems
  switch (alignItems) {
    case 'flex-start':
      props.align = 'top';
      break;
    case 'center':
      props.align = 'middle';
      break;
    case 'flex-end':
      props.align = 'bottom';
      break;
  }
  
  return props;
};

/**
 * Grid Component - Compatible with MUI Grid API
 * 
 * Usage:
 * ```tsx
 * // MUI style (works during migration)
 * <Grid container spacing={2}>
 *   <Grid item xs={12} md={6}>
 *     Content
 *   </Grid>
 * </Grid>
 * 
 * // AntD style (final target)
 * <Row gutter={16}>
 *   <Col xs={24} md={12}>
 *     Content
 *   </Col>
 * </Row>
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  container,
  item,
  spacing,
  direction = 'row',
  justifyContent,
  alignItems,
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  style,
  ...restProps
}) => {
  // If it's a container, render as Row
  if (container) {
    const gutter = convertSpacing(spacing);
    const flexProps = mapFlexProps(direction, justifyContent, alignItems);
    
    const rowStyle: React.CSSProperties = {
      flexDirection: direction as any,
      ...style,
    };
    
    return (
      <Row
        gutter={gutter}
        {...flexProps}
        style={rowStyle}
        {...restProps}
      >
        {children}
      </Row>
    );
  }
  
  // If it's an item, render as Col
  if (item) {
    const colProps: ColProps = {
      xs: convertColumns(xs),
      sm: convertColumns(sm),
      md: convertColumns(md),
      lg: convertColumns(lg),
      xl: convertColumns(xl),
      style,
      ...restProps,
    };
    
    return <Col {...colProps}>{children}</Col>;
  }
  
  // If neither container nor item, render as div
  return <div style={style} {...restProps}>{children}</div>;
};

/**
 * Container Component - Maps MUI Container to AntD Layout
 */
export interface ContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fixed?: boolean;
  disableGutters?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const maxWidthValues = {
  xs: 444,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  fixed,
  disableGutters,
  children,
  className,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: disableGutters ? 0 : 24,
    paddingRight: disableGutters ? 0 : 24,
    ...(maxWidth && maxWidth !== false ? {
      maxWidth: maxWidthValues[maxWidth],
    } : {}),
    ...style,
  };
  
  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

/**
 * Box Component - Maps MUI Box to div or Space
 */
export interface BoxProps {
  display?: 'flex' | 'inline-flex' | 'block' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
  p?: number; // padding
  m?: number; // margin
  mt?: number; // margin-top
  mb?: number; // margin-bottom
  ml?: number; // margin-left
  mr?: number; // margin-right
  pt?: number; // padding-top
  pb?: number; // padding-bottom
  pl?: number; // padding-left
  pr?: number; // padding-right
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Box: React.FC<BoxProps> = ({
  display,
  flexDirection,
  justifyContent,
  alignItems,
  gap,
  p, m, mt, mb, ml, mr, pt, pb, pl, pr,
  children,
  className,
  style,
  onClick,
}) => {
  // If it has gap and flex, use Space component
  if (gap && display?.includes('flex')) {
    return (
      <Space
        direction={flexDirection === 'column' ? 'vertical' : 'horizontal'}
        size={gap * 8}
        style={{
          width: flexDirection === 'column' ? '100%' : undefined,
          ...style,
        }}
        className={className}
      >
        {children}
      </Space>
    );
  }
  
  // Otherwise, use div with styles
  const boxStyle: React.CSSProperties = {
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap: gap ? gap * 8 : undefined,
    padding: p ? p * 8 : undefined,
    margin: m ? m * 8 : undefined,
    marginTop: mt ? mt * 8 : undefined,
    marginBottom: mb ? mb * 8 : undefined,
    marginLeft: ml ? ml * 8 : undefined,
    marginRight: mr ? mr * 8 : undefined,
    paddingTop: pt ? pt * 8 : undefined,
    paddingBottom: pb ? pb * 8 : undefined,
    paddingLeft: pl ? pl * 8 : undefined,
    paddingRight: pr ? pr * 8 : undefined,
    ...style,
  };
  
  return (
    <div className={className} style={boxStyle} onClick={onClick}>
      {children}
    </div>
  );
};

// Re-export AntD components for convenience
export { Row, Col, Space, Layout };
