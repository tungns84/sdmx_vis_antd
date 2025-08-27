import React, { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Space, Select, Button } from 'antd';
import { HomeOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import * as R from 'ramda';
import { changeLocale } from '../ducks/app';
import { resetDataflow } from '../ducks/sdmx';
import { getIsFull } from '../selectors';
import {
  getLocale,
  getIsRtl,
  getPathname,
} from '../selectors/router';
import { getAsset, getApp, locales } from '../lib/settings';
import styles from './AppBars.module.css';

const { Header } = Layout;

interface AppBarsProps {
  // No props needed, but keeping interface for future expansion
}

/**
 * AppBars Component - Migrated to AntD
 * Simplified version without search functionality
 */
const AppBars = forwardRef<HTMLDivElement, AppBarsProps>((_, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isVis = useSelector(getPathname) === '/vis';
  const isRtl = useSelector(getIsRtl);
  const localeId = useSelector(getLocale);
  const isFull = useSelector(getIsFull());

  const handleLocaleChange = (value: string) => {
    dispatch(changeLocale(value));
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (isVis) {
      dispatch(resetDataflow());
      navigate('/');
    }
  };

  if (isFull) {
    return <div ref={ref} />;
  }

  const logo = getAsset('header', localeId);
  const logoLink = getApp('headerLink', localeId);

  return (
    <div 
      ref={ref}
      className={styles.container}
      style={{ position: isVis ? 'fixed' : 'static' }}
    >
      {/* Top Bar */}
      <Header className={styles.topBar}>
        <div className={styles.topBarContent}>
          {/* Logo */}
          <div className={styles.logo}>
            {logo && (
              <a href={logoLink || '#'} target="_blank" rel="noopener noreferrer">
                <img src={logo} alt="Logo" className={styles.logoImage} />
              </a>
            )}
          </div>

          {/* Right side actions */}
          <Space size="middle">
            {/* Locale Selector */}
            <Select
              value={localeId}
              onChange={handleLocaleChange}
              suffixIcon={<GlobalOutlined />}
              className={styles.localeSelector}
              options={R.keys(locales).map(key => ({
                label: locales[key].label || key.toUpperCase(),
                value: key,
              }))}
            />
          </Space>
        </div>
      </Header>

      {/* Bottom Bar - Simplified Navigation */}
      <Header className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <Space size="large">
            {/* Home Button */}
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className={styles.navButton}
            >
              Home
            </Button>

            {/* Back Button (only in vis) */}
            {isVis && (
              <Button
                type="text"
                onClick={handleGoBack}
                className={styles.navButton}
              >
                Back to Overview
              </Button>
            )}
          </Space>

          {/* Breadcrumb or Status */}
          <div className={styles.pageInfo}>
            {location.pathname === '/' && 'Home'}
            {location.pathname === '/vis' && 'Data Visualization'}
            {location.pathname === '/demo' && 'Demo'}
          </div>
        </div>
      </Header>
    </div>
  );
});

AppBars.displayName = 'AppBars';

export default AppBars;
