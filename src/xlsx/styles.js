import * as R from 'ramda';
import { getLight, getDark, getFont } from '../theme/utils';

export const getRtlStyles = (isRtl) => ({
  textDirection: isRtl ? 'right-to-left' : 'left-to-right',
  horizontalAlignment: isRtl ? 'right' : 'left',
  comment: {
    horizontalAlignment: isRtl ? 'Right' : 'Left',
    textAlign: isRtl ? 'right' : 'left',
  },
});

export const getSectionStyles = (theme, styles = {}) => ({
  wrapText: true,
  verticalAlignment: 'top',
  horizontalAlignment: 'left',
  fill: R.tail(getDark(theme) || theme.palette.secondary.dark),
  fontColor: R.tail(getFont('sectionFont')(theme) || '#000000'),
  ...styles,
});

export const getHeaderStyles = (theme, styles = {}) => ({
  title: {
    border: true,
    bold: true,
    wrapText: true,
    verticalAlignment: 'top',
    horizontalAlignment: 'right',
    fill: R.tail(theme.palette.primary.main),
    fontColor: R.tail(getFont('headerFont')(theme) || '#ffffff'),
    ...styles,
  },
  value: {
    border: true,
    wrapText: true,
    verticalAlignment: 'top',
    fill: R.tail(theme.palette.primary.main),
    fontColor: R.tail(getFont('headerFont')(theme) || '#ffffff'),
    ...styles,
    horizontalAlignment: 'center',
  },
});

export const getRowStyles = (theme, styles = {}) => ({
  rowTitle: {
    border: true,
    bold: true,
    wrapText: true,
    horizontalAlignment: 'left',
    verticalAlignment: 'top',
    fill: R.tail(getLight(theme) || theme.palette.secondary.light),
    fontColor: R.tail(getFont('rowFont')(theme) || '#000000'),
    ...styles,
  },
  title: {
    border: true,
    wrapText: true,
    horizontalAlignment: 'left',
    verticalAlignment: 'top',
    fill: R.tail(getLight(theme) || theme.palette.secondary.light),
    fontColor: R.tail(getFont('rowFont')(theme) || '#000000'),
    ...styles,
  },
  space: {
    border: true,
    wrapText: true,
    horizontalAlignment: 'left',
    verticalAlignment: 'top',
    fill: R.tail(theme.palette.grey[100]),
    ...styles,
  },
  value: {
    border: true,
    wrapText: true,
    ...styles,
  },
});
