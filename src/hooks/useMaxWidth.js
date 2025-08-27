import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MARGE_SIZE, SIDE_WIDTH, SMALL_SIDE_WIDTH } from '../utils/constants';

export default ({ visWidth, isFull }) => {
  const theme = useTheme();
  const isDownXS = useMediaQuery(theme.breakpoints.down('xs'));
  const isBetweenSMMD = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isOnlyMD = useMediaQuery(theme.breakpoints.only('md'));
  const isUpLG = useMediaQuery(theme.breakpoints.up('lg'));

  if (isDownXS) return { maxWidth: 'none' };
  // careful with the theme.spacing they now have unit px added to them so the calc was returning wrong values
  if (isBetweenSMMD) {
    return {
      left: `${MARGE_SIZE}%`,
      maxWidth: visWidth,
    };
  }

  if (isOnlyMD) {
    return {
      left: isFull
        ? `${MARGE_SIZE}%`
        : `calc(${MARGE_SIZE}% + ${SMALL_SIDE_WIDTH}px + ${theme.spacing(2)})`,
      maxWidth: `calc(${visWidth}px - ${
        isFull ? 0 : SMALL_SIDE_WIDTH
      }px - ${theme.spacing(2)})`,
    };
  }

  if (isUpLG) {
    return {
      left: isFull
        ? `${MARGE_SIZE}%`
        : `calc(${MARGE_SIZE}% + ${SIDE_WIDTH}px + ${theme.spacing(2)})`,
      maxWidth: `calc(${visWidth}px - ${
        isFull ? 0 : SIDE_WIDTH
      }px - ${theme.spacing(2)})`,
    };
  }
};
