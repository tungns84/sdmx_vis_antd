import React from 'react';
import PropTypes from 'prop-types';
import { create } from 'jss';
import rtl from 'jss-rtl';
import StylesProvider from '@mui/styles/StylesProvider';
import jssPreset from '@mui/styles/jssPreset';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export const Rtl = (props) => (
  <StylesProvider jss={jss}>{props.children}</StylesProvider>
);

Rtl.propTypes = {
  children: PropTypes.element,
};
