// Simplified settings without auth and email
export const search = {
  api: window.CONFIG?.search?.api || '/api/search',
  endpoint: window.CONFIG?.search?.endpoint || '',
};

export const i18n = {
  locale: window.CONFIG?.i18n?.locale || 'en',
  locales: window.CONFIG?.i18n?.locales || ['en', 'vi'],
};

export const theme = {
  palette: {
    primary: { main: '#1890ff' },
    secondary: { main: '#52c41a' },
  },
};

export const isAuthRequired = false;
export const hasEmailFeature = false;
