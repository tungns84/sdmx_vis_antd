import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from '../i18n';
import * as R from 'ramda';
import Link from '@mui/material/Link';
import { SisccFooter } from '@sis-cc/dotstatsuite-visions';
import makeStyles from '@mui/styles/makeStyles';
import { getLocale, getPathname } from '../selectors/router';
import { getAsset } from '../lib/settings';
import useEventListener from '../utils/useEventListener';

const useStyles = makeStyles(() => ({
  img: {
    maxHeight: 20,
    verticalAlign: 'middle',
  },
}));

const Footer = () => {
  const classes = useStyles();
  const localeId = useSelector(getLocale);
  const logo = getAsset('footer', localeId);
  const isFixed = useSelector(getPathname) === '/vis';
  const ref = React.useRef(null);
  const [height, setHeight] = React.useState(76);

  useEventListener('resize', () => setHeight(ref.current.offsetHeight));

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, []);

  return (
    <>
      {isFixed && <div style={{ height }} />}
      <SisccFooter
        ref={ref}
        isFixed={isFixed}
        leftLabel={
          <FormattedMessage
            id="de.footer.description"
            values={{
              icon: <img className={classes.img} src={logo} alt="icon" />,
              link: (
                <Link
                  underline="hover"
                  color="primary"
                  href={R.path(['app', 'footer', 'link'], window.SETTINGS)}
                >
                  <FormattedMessage id="de.footer.author" />
                </Link>
              ),
            }}
          />
        }
        rightLabel={<FormattedMessage id="de.footer.disclaimer" />}
      />
    </>
  );
};

export default Footer;
