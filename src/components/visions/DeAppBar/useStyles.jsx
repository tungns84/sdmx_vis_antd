import makeStyles from '@mui/styles/makeStyles';
import { MARGE_SIZE } from '../../../utils/constants';

export default makeStyles((theme) => ({
  appBar: {
    minWidth: 300,
    backgroundColor: theme.palette.tertiary.main,
  },
  toolBar: {
    paddingLeft: `${MARGE_SIZE}%`,
    paddingRight: `${MARGE_SIZE}%`,
  },
  logoWrapper: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: 45,
    width: 'auto',
    imageRendering: 'crisp-edges',
  },
  // https://caniuse.com/mdn-css_properties_image-rendering_crisp-edges
  alternativeBrowserLogo: {
    imageRendering: '-webkit-optimize-contrast',
  },
  backLink: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  backIcon: {
    fontSize: '0.75rem',
    marginBottom: -1,
  },
  fixed: {
    position: 'fixed',
    top: 64,
    width: '100%',
  },
}));
