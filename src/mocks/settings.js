export default {
  sdmx: {
    range: [1, 3000],
    attributes: {
      flags: ['OBS_STATUS'],
      footnotes: ['TIME_FORMAT'],
      prefscale: 'PREF_SCALE',
      decimals: 'DECIMALS',
    },
    period: {
      boundaries: [1970, 2020],
      default: [2018, 2018],
    },
  },
  viewer: {
    owner: 'OECD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/OECD_logo_new.svg/200px-OECD_logo_new.svg.png',
    terms: {
      label: 'Terms & Conditions',
      link: 'http://www.oecd.org/termsandconditions/',
    },
  },
  app: {
    title: 'OECD Data Explorer',
    favicon: '/assets/oecd/data-explorer/images/favicon.ico',
  },
  assets: {
    header: '/assets/oecd/data-explorer/images/sis-cc-logo.png',
    subheader:
      '/assets/oecd/data-explorer/images/dotstat-data-explorer-logo.png',
    footer: '/assets/oecd/data-explorer/images/sis-cc-icon.png',
    splash: '/assets/oecd/data-explorer/images/dotstat-data-explorer-logo.png',
  },
  chart: {
    url: 'http://dotstatcor-dev1.main.oecd.org/FEDev2DesignViewer',
    source: 'http://dotstat.oecd.org/',
    options: {
      base: {
        height: 400,
      },
      axis: {
        x: {
          font: {
            family: "'Segoe UI'",
          },
        },
        y: {
          font: {
            family: "'Segoe UI'",
          },
        },
      },
      serie: {
        annotation: {
          font: {
            family: "'Segoe UI'",
          },
        },
        tooltip: {
          font: {
            family: "'Segoe UI'",
          },
        },
      },
    },
    size: {
      height: 400,
    },
  },
  theme: {
    visFont: "'Segoe UI'",
  },
  i18n: {
    localeId: 'en',
    locales: {
      en: {
        id: 'en',
        delimiters: { thousands: ',', decimal: '.' },
      },
      fr: {
        id: 'fr',
        delimiters: { thousands: ' ', decimal: ',' },
      },
      es: {
        id: 'es',
        delimiters: { thousands: ' ', decimal: ',' },
      },
      ar: {
        id: 'ar',
        isRtl: 'true',
        delimiters: { thousands: ' ', decimal: ',' },
      },
    },
  },
  styles: '/assets/oecd/data-explorer/styles/styles.css',
  search: {
    endpoint: 'http://sfs.staging.oecd.redpelicans.com/api',
  },
  share: {
    endpoint: 'http://dotstatcor-dev1.main.oecd.org/FEDev2ShareIntranetService',
  },
};
