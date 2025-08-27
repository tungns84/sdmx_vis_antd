import React from 'react';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';
import type { TextProps } from 'antd/es/typography/Text';
import type { ParagraphProps } from 'antd/es/typography/Paragraph';

const { Title, Text, Paragraph, Link } = Typography;

/**
 * TypographyWrapper - Maps MUI Typography props to AntD Typography
 */

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'caption' | 'overline'
  | 'button';

export interface TypographyWrapperProps {
  variant?: TypographyVariant;
  component?: keyof JSX.IntrinsicElements;
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'inherit';
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Maps MUI variant to AntD component and props
 */
const mapVariantToComponent = (variant?: TypographyVariant): {
  Component: typeof Title | typeof Text | typeof Paragraph;
  props: Partial<TitleProps | TextProps | ParagraphProps>;
} => {
  switch (variant) {
    case 'h1':
      return { Component: Title, props: { level: 1 } as TitleProps };
    case 'h2':
      return { Component: Title, props: { level: 2 } as TitleProps };
    case 'h3':
      return { Component: Title, props: { level: 3 } as TitleProps };
    case 'h4':
      return { Component: Title, props: { level: 4 } as TitleProps };
    case 'h5':
      return { Component: Title, props: { level: 5 } as TitleProps };
    case 'h6':
      return { Component: Title, props: { level: 5 } as TitleProps }; // AntD only has 5 levels
    
    case 'subtitle1':
      return { Component: Text, props: { strong: true } as TextProps };
    case 'subtitle2':
      return { Component: Text, props: { strong: true, type: 'secondary' } as TextProps };
    
    case 'body1':
      return { Component: Paragraph, props: {} };
    case 'body2':
      return { Component: Paragraph, props: { type: 'secondary' } as ParagraphProps };
    
    case 'caption':
      return { Component: Text, props: { type: 'secondary' } as TextProps };
    case 'overline':
      return { Component: Text, props: { type: 'secondary', style: { textTransform: 'uppercase' } } as TextProps };
    case 'button':
      return { Component: Text, props: { strong: true, style: { textTransform: 'uppercase' } } as TextProps };
    
    default:
      return { Component: Text, props: {} };
  }
};

/**
 * Maps MUI color to AntD type
 */
const mapColorToType = (color?: string): TextProps['type'] | undefined => {
  switch (color) {
    case 'primary':
      return undefined; // default color
    case 'secondary':
    case 'textSecondary':
      return 'secondary';
    case 'error':
      return 'danger';
    default:
      return undefined;
  }
};

/**
 * TypographyWrapper Component
 * 
 * Usage:
 * ```tsx
 * // MUI style (works during migration)
 * <TypographyWrapper variant="h1">Heading</TypographyWrapper>
 * <TypographyWrapper variant="body1">Body text</TypographyWrapper>
 * 
 * // Can also use AntD components directly
 * <Title level={1}>Heading</Title>
 * <Paragraph>Body text</Paragraph>
 * ```
 */
const TypographyWrapper: React.FC<TypographyWrapperProps> = ({
  variant = 'body1',
  color,
  align,
  gutterBottom,
  noWrap,
  paragraph,
  children,
  className,
  style,
  onClick,
  ...restProps
}) => {
  const { Component, props: componentProps } = mapVariantToComponent(variant);
  
  // Map color to type
  const type = mapColorToType(color);
  
  // Combine styles
  const combinedStyle: React.CSSProperties = {
    textAlign: align,
    marginBottom: gutterBottom ? '0.35em' : undefined,
    ...(noWrap ? {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } : {}),
    ...style,
    ...(componentProps.style || {}),
  };

  // Type assertion to handle the union type
  const finalProps = {
    ...componentProps,
    ...(type && { type }),
    className,
    style: combinedStyle,
    onClick,
    ...restProps,
  } as any;

  return <Component {...finalProps}>{children}</Component>;
};

export default TypographyWrapper;

// Re-export Typography components for convenience
export { Title, Text, Paragraph, Link };
