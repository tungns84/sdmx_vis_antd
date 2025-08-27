import makeStyles from '@mui/styles/makeStyles';
import { MARGE_SIZE } from '../../../utils/constants';

export default makeStyles((theme) => ({
  appBar: {
    background: theme.palette.grey[100],
    minWidth: 300,
  },
  fixed: {
    position: 'fixed',
    width: '100%',
    minHeight: 64,
    zIndex: 0,
  },
  toolBar: {
    paddingLeft: `${MARGE_SIZE}%`,
    paddingRight: `${MARGE_SIZE}%`,
    minHeight: 64,
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
  textField: {
    minWidth: 'fit-content',
  },
  select: {
    ...theme.typography.body2,
    lineHeight: 0,
  },
  arrowDown: {
    top: 8,
  },
  menuItem: {
    color: theme.palette.primary.main,
  },
  paper: {
    maxHeight: 320,
  },
  divider: {
    margin: theme.spacing(1),
  },
  value: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    '& svg': {
      marginRight: theme.spacing(0.5),
      fontSize: '1.4rem',
    },
  },
  headerTitle: {
    color: theme.palette.grey['A700'],
  },
  headerNote: {
    borderTop: '1px solid black',
    minHeight: 0,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: `${MARGE_SIZE}%`,
    paddingRight: `${MARGE_SIZE}%`,
  },
  reducedMenu: {
    borderRadius: 0,
    border: '1px solid gray',
  },
  reducedMenuItem: {
    width: 250,
  },
  reducedMenuIcon: {
    minWidth: 0,
    marginRight: 10,
  },
}));
