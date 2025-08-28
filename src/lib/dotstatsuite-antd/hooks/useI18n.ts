import { useState, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

export type LocaleType = 'en' | 'vi' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'ru' | 'it' | 'nl' | 'km' | 'th';

export interface I18nContextValue {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  formatMessage: (id: string, values?: Record<string, any>) => string;
  messages: Record<string, string>;
}

/**
 * Hook for i18n functionality in SDMX components
 */
export const useI18n = () => {
  const intl = useIntl();
  
  const formatMessage = useCallback((id: string, values?: Record<string, any>) => {
    try {
      return intl.formatMessage({ id }, values);
    } catch (error) {
      // Fallback to the id if translation not found
      return id;
    }
  }, [intl]);

  return {
    locale: intl.locale as LocaleType,
    formatMessage,
    messages: intl.messages as Record<string, string>,
  };
};

/**
 * Get localized value from SDMX data
 * SDMX data often contains names in multiple languages
 */
export const getLocalizedValue = (
  data: any, 
  locale: LocaleType, 
  fallbackLocale: LocaleType = 'en'
): string => {
  if (!data) return '';
  
  // If it's a string, return it directly
  if (typeof data === 'string') return data;
  
  // Priority 1: Check names property (most common in SDMX)
  if (data.names) {
    if (data.names[locale]) return data.names[locale];
    if (data.names[fallbackLocale]) return data.names[fallbackLocale];
    // Return first available name
    const firstKey = Object.keys(data.names)[0];
    if (firstKey) return data.names[firstKey];
  }
  
  // Priority 2: Check if name is an object with locale keys
  if (data.name && typeof data.name === 'object') {
    if (data.name[locale]) return data.name[locale];
    if (data.name[fallbackLocale]) return data.name[fallbackLocale];
  }
  
  // Priority 3: Use name as string (may be default language)
  if (data.name && typeof data.name === 'string') {
    return data.name;
  }
  
  // Priority 4: Check label property
  if (data.label) {
    if (typeof data.label === 'string') return data.label;
    if (data.label[locale]) return data.label[locale];
    if (data.label[fallbackLocale]) return data.label[fallbackLocale];
  }
  
  // Priority 5: Check if the object itself has locale keys
  if (data[locale]) return data[locale];
  if (data[fallbackLocale]) return data[fallbackLocale];
  
  // Priority 6: Fallback to id if available
  if (data.id) return data.id;
  
  // Return empty string if nothing found
  return '';
};

/**
 * Hook for SDMX localization
 */
export const useSDMXLocalization = (initialLocale?: LocaleType) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleType>(initialLocale || 'en');
  
  const getLocalizedName = useCallback((data: any): string => {
    return getLocalizedValue(data, currentLocale);
  }, [currentLocale]);
  
  const getLocalizedDimension = useCallback((dimension: any) => {
    return {
      ...dimension,
      name: getLocalizedName(dimension),
      values: dimension.values?.map((value: any) => ({
        ...value,
        name: getLocalizedName(value)
      })) || []
    };
  }, [getLocalizedName]);
  
  const getLocalizedObservation = useCallback((observation: any) => {
    const localized = { ...observation };
    
    // Localize dimension values
    if (observation.dimensions) {
      localized.dimensions = Object.entries(observation.dimensions).reduce((acc, [key, value]) => {
        acc[key] = getLocalizedName(value);
        return acc;
      }, {} as Record<string, string>);
    }
    
    // Localize attributes
    if (observation.attributes) {
      localized.attributes = Object.entries(observation.attributes).reduce((acc, [key, value]) => {
        acc[key] = getLocalizedName(value);
        return acc;
      }, {} as Record<string, string>);
    }
    
    return localized;
  }, [getLocalizedName]);
  
  return {
    locale: currentLocale,
    setLocale: setCurrentLocale,
    getLocalizedName,
    getLocalizedDimension,
    getLocalizedObservation,
  };
};
