import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IntlProvider, useIntl, MessageDescriptor } from 'react-intl';
import { messages as tableMessages } from '../i18n/messages';

export type LocaleType = 'en' | 'vi' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'ru' | 'it' | 'nl' | 'km' | 'th';

interface I18nContextValue {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  formatMessage: (descriptor: MessageDescriptor, values?: Record<string, any>) => string;
  getLocalizedSDMXValue: (data: any) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * Provider component for SDMX Table i18n
 */
interface SDMXTableI18nProviderProps {
  children: ReactNode;
  defaultLocale?: LocaleType;
  onLocaleChange?: (locale: LocaleType) => void;
}

export const SDMXTableI18nProvider: React.FC<SDMXTableI18nProviderProps> = ({
  children,
  defaultLocale = 'en',
  onLocaleChange
}) => {
  const [locale, setLocaleState] = useState<LocaleType>(defaultLocale);

  const setLocale = useCallback((newLocale: LocaleType) => {
    setLocaleState(newLocale);
    if (onLocaleChange) {
      onLocaleChange(newLocale);
    }
  }, [onLocaleChange]);

  const currentMessages = tableMessages[locale] || tableMessages.en;

  return (
    <IntlProvider 
      locale={locale} 
      messages={currentMessages}
      key={locale}
    >
      <I18nContextInner locale={locale} setLocale={setLocale}>
        {children}
      </I18nContextInner>
    </IntlProvider>
  );
};

/**
 * Inner context provider that has access to IntlProvider
 */
const I18nContextInner: React.FC<{
  children: ReactNode;
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
}> = ({ children, locale, setLocale }) => {
  const intl = useIntl();

  const formatMessage = useCallback((
    descriptor: MessageDescriptor,
    values?: Record<string, any>
  ) => {
    return intl.formatMessage(descriptor, values);
  }, [intl]);

  const getLocalizedSDMXValue = useCallback((data: any): string => {
    if (!data) return '';
    
    // If it's a string, return it directly
    if (typeof data === 'string') return data;
    
    // Priority 1: Check names property (most common in SDMX)
    if (data.names) {
      if (data.names[locale]) return data.names[locale];
      if (data.names.en) return data.names.en;
      // Return first available name
      const firstKey = Object.keys(data.names)[0];
      if (firstKey) return data.names[firstKey];
    }
    
    // Priority 2: Check if name is an object with locale keys
    if (data.name && typeof data.name === 'object') {
      if (data.name[locale]) return data.name[locale];
      if (data.name.en) return data.name.en;
    }
    
    // Priority 3: Use name as string
    if (data.name && typeof data.name === 'string') {
      return data.name;
    }
    
    // Priority 4: Fallback to id
    if (data.id) return data.id;
    
    return '';
  }, [locale]);

  const contextValue: I18nContextValue = {
    locale,
    setLocale,
    formatMessage,
    getLocalizedSDMXValue
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Hook to use i18n context
 */
export const useSDMXTableI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useSDMXTableI18n must be used within SDMXTableI18nProvider');
  }
  return context;
};

/**
 * Hook for component-specific messages
 */
export const useComponentMessages = (componentPrefix: string) => {
  const { formatMessage } = useSDMXTableI18n();
  
  return useCallback((
    key: string,
    values?: Record<string, any>
  ) => {
    const messageKey = `${componentPrefix}.${key}`;
    return formatMessage({ id: messageKey }, values);
  }, [formatMessage, componentPrefix]);
};
