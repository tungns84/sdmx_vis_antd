import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as R from 'ramda';
import { sisccTheme } from '@sis-cc/dotstatsuite-visions';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { getIsRtl, getHasAccessibility } from '../selectors/router';
import { Rtl } from './jss-provider';

const excel = {
  headerFont: '#ffffff',
  sectionFont: '#000000',
  rowFont: '#000000',
};

const Provider = ({ theme, children, isRtl, isA11y }) => {
  const muiTheme = R.pipe(
    R.flip(R.mergeDeepRight)(theme),
    R.assocPath(['mixins', 'excel'], excel),
    createTheme,
  )(
    sisccTheme({
      rtl: isRtl ? 'rtl' : 'ltr',
      isA11y,
      outerPalette: theme.outerPalette,
    }),
  );

  return (
    <Rtl>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          {React.Children.only(children)}
        </ThemeProvider>
      </StyledEngineProvider>
    </Rtl>
  );
};

Provider.propTypes = {
  theme: PropTypes.object,
  children: PropTypes.element.isRequired,
  isRtl: PropTypes.bool,
  isA11y: PropTypes.bool,
};

export default connect(
  createStructuredSelector({ isRtl: getIsRtl, isA11y: getHasAccessibility }),
)(Provider);
