import React, { forwardRef } from 'react';
import cx from 'classnames';
import { CLASS_PAGE } from '../../css-api';

const Page = forwardRef(
  ({ id, alignSelf, classNames, children, styles }, ref) => {
    return (
      <div
        id={id}
        ref={ref}
        className={cx(CLASS_PAGE, classNames)}
        style={{ flexGrow: 1, alignSelf, ...styles }}
      >
        {children}
      </div>
    );
  },
);

export default Page;
