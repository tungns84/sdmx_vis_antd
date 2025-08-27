import React from 'react';
import * as R from 'ramda';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { innerPalette } from '@sis-cc/dotstatsuite-visions';
import {
  getIsRtl,
  getLocale,
  getHasAccessibility,
  getPathname,
} from '../selectors/router';
import { getDataflowName } from '../selectors/sdmx';
import { outerPalette } from '../lib/settings';
import { formatMessage } from '../i18n';
import messages from './messages';

const View = () => {
  const intl = useIntl();
  const isRtl = useSelector(getIsRtl);
  const isA11y = useSelector(getHasAccessibility);
  const lang = useSelector(getLocale);
  const dataflowName = useSelector(getDataflowName);
  const pathname = useSelector(getPathname);

  return (
    <Helmet htmlAttributes={{ lang, dir: isRtl ? 'rtl' : 'ltr' }}>
      <title>
        {formatMessage(intl)(
          R.propOr(R.prop('/', messages), pathname, messages),
          { dataflowName },
        )}
      </title>
      {isA11y && (
        <style type="text/css">{`
          :focus {
            outline-color: ${
              outerPalette.highlight1 || innerPalette.highlight1
            } !important;
          }
        `}</style>
      )}
    </Helmet>
  );
};

export default View;
