import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from '../i18n';
import * as R from 'ramda';
import { Typography } from 'antd';
import { SisccFooter } from '@sis-cc/dotstatsuite-visions';
import { getLocale, getPathname } from '../selectors/router';
import { getAsset } from '../lib/settings';
import useEventListener from '../utils/useEventListener';
import styles from './footer.module.css';

const { Link } = Typography;

/**
 * Footer Component
 * Migrated from MUI to AntD
 * - MUI Link → AntD Typography.Link
 * - makeStyles → CSS modules
 */
const Footer: React.FC = () => {
  const localeId = useSelector(getLocale);
  const logo = getAsset('footer', localeId);
  const isFixed = useSelector(getPathname) === '/vis';
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(76);

  useEventListener('resize', () => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  });

  useEffect(() => {
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
              icon: <img className={styles.img} src={logo} alt="icon" />,
              link: (
                <Link
                  href={R.path(['app', 'footer', 'link'], window.SETTINGS)}
                  target="_blank"
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
