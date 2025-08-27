import React, { forwardRef, CSSProperties } from 'react';
import cx from 'classnames';
import { CLASS_PAGE } from '../../css-api';

interface PageProps {
  id?: string;
  alignSelf?: CSSProperties['alignSelf'];
  classNames?: string;
  styles?: CSSProperties;
  children?: React.ReactNode;
}

/**
 * Page Component - Simple wrapper component
 * Provides consistent page layout structure
 */
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ id, alignSelf, classNames, children, styles }, ref) => {
    return (
      <div
        id={id}
        ref={ref}
        className={cx(CLASS_PAGE, classNames)}
        style={{ 
          flexGrow: 1, 
          alignSelf, 
          ...styles 
        }}
      >
        {children}
      </div>
    );
  }
);

Page.displayName = 'Page';

export default Page;
