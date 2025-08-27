import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getLocale } from '../selectors/router';
import { getDefaultTitleLabel } from '../selectors/data';
import { getAsset } from '../lib/settings';
import { formatMessage } from '../i18n';
import Link from '@mui/material/Link';
import messages from '../components/messages';

export default () => {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const label = useSelector(getDefaultTitleLabel);
  const logo = getAsset('viewerFooter', locale);
  const formattedMessage = formatMessage(intl);

  return {
    isSticky: true,
    source: {
      label,
      link: window.location.href,
    },
    logo,
    copyright: {
      label: (
        <Link
          href={formattedMessage(messages.viewerLink)}
          rel="noopener noreferrer"
          target="_blank"
          variant="body2"
        >
          {formattedMessage(messages.footerCopyright)}
        </Link>
      ),
      content: `${formattedMessage(
        messages.viewerContentLabel,
      )} ${formattedMessage(messages.viewerLinkLabel)}`,
    },
  };
};
