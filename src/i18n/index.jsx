import numeral from 'numeral';
import * as R from 'ramda';
import React from 'react';
import { FormattedMessage as RIFormattedMessage } from 'react-intl';
import Link from '@mui/material/Link';

const model = (locale) => `${locale}/${locale}`;

export const setLocale = (locale) => numeral.locale(model(locale));

export const initialize = ({ locales = [] }, currentLocale) => {
  R.forEach((locale) => {
    const delimiters = R.prop('delimiters')(locale);
    if (R.isNil(delimiters)) return;
    numeral.register('locale', model(R.prop('id')(locale)), { delimiters });
  }, R.values(locales));
  setLocale(currentLocale);
};

export { default as I18nProvider } from './provider';

const richValues = {
  br: <br />, // new line -> {br}
  i: (chunks) => <i>{chunks}</i>, // italic   -> <i>...</i>
  b: (chunks) => <b>{chunks}</b>, // bold          -> <b>...</b>
  a: (chunks = []) => {
    const [anchor, href] = R.split('|', R.head(chunks));
    return (
      <Link target="_blank" rel="noopener noreferrer" href={href}>
        {anchor}
      </Link>
    );
  }, // link     -> <a>...</a>
};

export const FormattedMessage = ({ values = {}, ...rest }) => (
  <RIFormattedMessage {...rest} values={{ ...values, ...richValues }} />
);

export const formatMessage =
  (intl) =>
  (message, values = {}) =>
    intl.formatMessage(message, { ...richValues, ...values });
