import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { getLocale } from '../selectors/router';

const Provider = ({ messages, children, locale }) => {
  const localeId = useSelector(getLocale) || locale || 'en';
  // Support both nested messages (by locale) and flat messages
  const actualMessages = messages[localeId] || messages;
  return (
    <IntlProvider
      locale={localeId}
      key={localeId}
      messages={actualMessages}
    >
      {React.Children.only(children)}
    </IntlProvider>
  );
};

Provider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default Provider;
