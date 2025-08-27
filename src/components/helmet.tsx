import React from 'react';
import * as R from 'ramda';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  getIsRtl,
  getLocale,
  getHasAccessibility,
  getPathname,
} from '../selectors/router';
import { getDataflowName } from '../selectors/sdmx';
import { formatMessage } from '../i18n';
import messages from './messages';

/**
 * Helmet Component - Manages document head
 * Migrated to TypeScript
 * Sets page title, language, and accessibility styles
 */
const HelmetView: React.FC = () => {
  const intl = useIntl();
  const isRtl = useSelector(getIsRtl);
  const isA11y = useSelector(getHasAccessibility);
  const lang = useSelector(getLocale);
  const dataflowName = useSelector(getDataflowName);
  const pathname = useSelector(getPathname);

  // AntD primary color for accessibility
  const primaryColor = '#1890ff';

  return (
    <Helmet htmlAttributes={{ lang, dir: isRtl ? 'rtl' : 'ltr' }}>
      <title>
        {formatMessage(intl)(
          R.propOr(R.prop('/', messages), pathname, messages),
          { dataflowName }
        )}
      </title>
      {isA11y && (
        <style type="text/css">{`
          :focus {
            outline-color: ${primaryColor} !important;
            outline-width: 2px !important;
            outline-style: solid !important;
          }
          
          /* AntD specific accessibility enhancements */
          .ant-btn:focus,
          .ant-input:focus,
          .ant-select:focus .ant-select-selector,
          .ant-checkbox-wrapper:focus .ant-checkbox,
          .ant-radio-wrapper:focus .ant-radio {
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        `}</style>
      )}
    </Helmet>
  );
};

export default HelmetView;
