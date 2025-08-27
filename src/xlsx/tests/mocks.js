import * as R from 'ramda';

const tableProps = {
  cells: {
    0: {
      '0:0': {
        0: [
          {
            flags: [
              {
                code: 'p_p',
                id: 'OBS',
                name: 'Observation',
                value: { id: 'TEST', name: 'test' },
              },
            ],
            intValue: 181.491,
            value: '181.491',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 2335.617,
            value: '2,335.617',
          },
        ],
      },
      '1:1': {
        0: [
          {
            flags: [],
            intValue: 21.39,
            value: '21.39',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 150.089,
            value: '150.089',
          },
        ],
      },
      '1:0': {
        0: [
          {
            flags: [],
            intValue: 15.764,
            value: '15.764',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 2380.047,
            value: '2,380.047',
          },
        ],
      },
      '0:1': {
        0: [
          {
            flags: [],
            intValue: 83.067,
            value: '83.067',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 144.107,
            value: '144.107',
          },
        ],
      },
    },
    1: {
      '0:0': {
        0: [
          {
            flags: [],
            intValue: 171.711,
            value: '171.711',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 2282.374,
            value: '2,282.374',
          },
        ],
      },
      '1:1': {
        0: [
          {
            flags: [],
            intValue: 20.324,
            value: '20.324',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 158.15,
            value: '158.15',
          },
        ],
      },
      '1:0': {
        0: [
          {
            flags: [],
            intValue: 14.979,
            value: '14.979',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 2507.875,
            value: '2,507.875',
          },
        ],
      },
      '0:1': {
        0: [
          {
            flags: [],
            intValue: 78.591,
            value: '78.591',
          },
        ],
        1: [
          {
            flags: [],
            intValue: 140.822,
            value: '140.822',
          },
        ],
      },
    },
  },
  headerData: [
    {
      data: [
        {
          dimension: {
            id: 'YEAR',
            name: 'Year',
            flags: [],
          },
          value: {
            id: '2010',
            name: '2010',
            flags: [],
          },
        },
      ],
      key: '0',
      flags: [],
    },
    {
      data: [
        {
          dimension: {
            id: 'YEAR',
            name: 'Year',
            flags: [],
          },
          value: {
            id: '2011',
            name: '2011',
            flags: [],
          },
        },
      ],
      key: '1',
      flags: [],
    },
  ],
  sectionsData: [
    [
      {
        data: [
          {
            dimension: {
              name: 'Pollutant',
              flags: [],
            },
            value: {
              name: 'Sulphur Oxides',
              flags: [],
            },
          },
          {
            dimension: {
              name: 'Variable',
              flags: [],
            },
            value: {
              name: 'Total man-made emissions',
              flags: [],
            },
          },
        ],
        key: '1:0',
        flags: [],
      },
      [
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Australia',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '1',
          flags: [],
        },
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Austria',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '0',
          flags: [],
        },
      ],
    ],
    [
      {
        data: [
          {
            dimension: {
              name: 'Pollutant',
              flags: [],
            },
            value: {
              name: 'Sulphur Oxides',
              flags: [],
            },
          },
          {
            dimension: {
              name: 'Variable',
              flags: [],
            },
            value: {
              name: 'Total emissions, Index 1990 = 100',
              flags: [],
            },
          },
        ],
        key: '1:1',
        flags: [],
      },
      [
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Australia',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '1',
          flags: [],
        },
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Austria',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '0',
          flags: [],
        },
      ],
    ],
    [
      {
        data: [
          {
            dimension: {
              name: 'Pollutant',
              flags: [],
            },
            value: {
              name: 'Nitrogen Oxides',
              flags: [],
            },
          },
          {
            dimension: {
              name: 'Variable',
              flags: [],
            },
            value: {
              name: 'Total man-made emissions',
              flags: [],
            },
          },
        ],
        key: '0:0',
        flags: [],
      },
      [
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Australia',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '1',
          flags: [],
        },
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Austria',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '0',
          flags: [],
        },
      ],
    ],
    [
      {
        data: [
          {
            dimension: {
              name: 'Pollutant',
              flags: [],
            },
            value: {
              name: 'Nitrogen Oxides',
              flags: [],
            },
          },
          {
            dimension: {
              name: 'Variable',
              flags: [],
            },
            value: {
              name: 'Total emissions, Index 1990 = 100',
              flags: [],
            },
          },
        ],
        key: '0:1',
        flags: [],
      },
      [
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Australia',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '1',
          flags: [],
        },
        {
          data: [
            {
              dimension: {
                name: 'Country',
                flags: [],
              },
              value: {
                name: 'Austria',
                flags: [],
                parents: [],
              },
            },
          ],
          key: '0',
          flags: [],
        },
      ],
    ],
  ],
  labelAccessor: R.prop('name'),
};

export default {
  tableProps,
  footerProps: {
    owner: 'OECD',
    logo: '/assets/siscc/data-explorer/images/sis-cc-logo.png',
    copyright: {
      label: '©',
      content: 'Terms & Conditions',
      link: 'http://www.oecd.org/termsandconditions/',
    },
    source: {
      link: 'http://167.71.37.36:7000/vis?dataquery=AUT%2BAUS.SOX%2BNOX.TOT%2BINDEX_1990&period=2010%2C2011&frequency=A&locale=en&tenant=oecd&term=air&start=0&dataflow[datasourceId]=SIS-CC-stable&dataflow[dataflowId]=AIR_EMISSIONS_DF&dataflow[agencyId]=OECD&dataflow[version]=1.0',
      label: 'Emissions of air pollutants',
    },
  },
  headerProps: {
    title: {
      label: 'Emissions of air pollutants',
      flags: [],
    },
    subtitle: [],
    combinations: [{ header: 'Units of Measure:', label: '1990=100' }],
    disclaimer: null,
  },
  theme: {
    breakpoints: {
      keys: ['xs', 'sm', 'md', 'lg', 'xl'],
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    direction: 'ltr',
    mixins: {
      toolbar: {
        minHeight: 56,
        '@media (min-width:0px) and (orientation: landscape)': {
          minHeight: 48,
        },
        '@media (min-width:600px)': {
          minHeight: 64,
        },
      },
    },
    overrides: {},
    palette: {
      common: {
        black: '#000',
        white: '#fff',
      },
      type: 'light',
      primary: {
        main: '#137cbd',
        mainAlpha: '#137cbd26',
        light: '#5dabf0',
        dark: '#00508c',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#bdd7ee',
        light: '#f0ffff',
        dark: '#8ca6bc',
        contrastText: '#ff0000',
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#d32f2f',
        contrastText: '#fff',
      },
      grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#d5d5d5',
        A200: '#aaaaaa',
        A400: '#303030',
        A700: '#616161',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      background: {
        paper: '#fff',
        default: '#fafafa',
      },
      action: {
        active: 'rgba(19,124,189,.3)',
        hover: '#bdd7ee',
        hoverOpacity: 0.08,
        selected: '#137cbd',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
      },
      typography: {
        fontFamily: ['Segoe UI'],
      },
      raisedButton: {
        textColor: '#ffffff',
        primaryTextColor: '#ffffff',
      },
      default: {
        backgroundColor: '#00000026',
      },
      configLabelBG: '#B5CEEB',
      configLabelCol: '#1C2768',
    },
    props: {},
    shadows: [
      'none',
      '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
      '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
      '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
      '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
      '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
      '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
      '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
      '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    ],
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      display4: {
        fontSize: '7rem',
        fontWeight: 300,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        letterSpacing: '-.04em',
        lineHeight: '1.14286em',
        marginLeft: '-.04em',
        color: 'rgba(0, 0, 0, 0.54)',
      },
      display3: {
        fontSize: '3.5rem',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        letterSpacing: '-.02em',
        lineHeight: '1.30357em',
        marginLeft: '-.02em',
        color: 'rgba(0, 0, 0, 0.54)',
      },
      display2: {
        fontSize: '2.8125rem',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        lineHeight: '1.13333em',
        marginLeft: '-.02em',
        color: 'rgba(0, 0, 0, 0.54)',
      },
      display1: {
        fontSize: '2.125rem',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        lineHeight: '1.20588em',
        color: 'rgba(0, 0, 0, 0.54)',
      },
      headline: {
        fontSize: '1.5rem',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        lineHeight: '1.35417em',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      title: {
        fontSize: '1.3125rem',
        fontWeight: 500,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        lineHeight: '1.16667em',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      subheading: {
        fontSize: '1rem',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        lineHeight: '1.5em',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      body2: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
      },
      body1: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      caption: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      button: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
      },
      h1: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 300,
        fontSize: '6rem',
        lineHeight: 1,
        letterSpacing: '-0.01562em',
      },
      h2: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 300,
        fontSize: '3.75rem',
        lineHeight: 1,
        letterSpacing: '-0.00833em',
      },
      h3: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '3rem',
        lineHeight: 1.04,
        letterSpacing: '0em',
      },
      h4: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: 1.17,
        letterSpacing: '0.00735em',
      },
      h5: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.5rem',
        lineHeight: 1.33,
        letterSpacing: '0em',
      },
      h6: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1Next: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2Next: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
      },
      buttonNext: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
      },
      captionNext: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
      useNextVariants: true,
    },
    shape: {
      borderRadius: 4,
    },
    spacing: {
      unit: 8,
    },
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    zIndex: {
      mobileStepper: 1000,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
    app: {
      appSize: 1000,
      appMinSize: 360,
      itemMinSize: 350,
    },
    scopeListContainer: {
      maxHeight: 250,
    },
    scopeList: {
      divider: '#000000',
    },
    configLabel: {
      backgroundColor: '#B5CEEB',
      color: '#43679F',
      fontFamily: 'Segoe UI',
      fontSize: 16,
    },
    configButtonRegular: {
      backgroundColor: '#B5CEEB',
      color: '#43679F',
      fontFamily: 'Segoe UI',
      fontSize: 16,
      fontWeight: 'inherit',
      textTransform: 'none',
    },
    configButtonSelected: {
      backgroundColor: '#778899',
      color: '#B5CEEB',
      fontFamily: 'Segoe UI',
      fontSize: 16,
      fontWeight: 'inherit',
      textTransform: 'none',
    },
    panelSummary: {
      backgroundColor: '#137cbd',
      color: 'white',
      fontFamily: 'Segoe UI',
      fontSize: 16,
    },
    panelIcon: {
      color: 'white',
    },
    configInputs: {
      backgroundColor: 'white',
    },
    alert: {
      color: '#c23030',
      hover: {
        backgroundColor: 'rgba(219,55,55,.15)',
      },
      active: {
        backgroundColor: 'rgba(219,55,55,.3)',
      },
    },
    iconButton: {
      color: '#000000',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:active': {
        backgroundColor: 'transparent',
      },
    },
    table: {
      yBg: '#B5CEEB',
      yBgHover: '#c3d7ef',
      yBgActive: '#7e90a4',
      yFontHeader: '#1C2768',
      yFont: '#43679F',
      zBg: '#386CAA',
      zBgHover: '#5f89bb',
      zBgActive: '#274b76',
      zFontHeader: '#A2C2E4',
      zFont: '#FFFFFF',
      xBg: '#FFFFFF',
      xBgHeader: '#D7E6F4',
      xBgHover: '#dfebf6',
      xBgActive: '#96a1aa',
      xFontHeader: '#1C2768',
      xFont: '#43679F',
      oFont: '#494444',
      sBg: '#F0F0F0',
    },
  },
};
