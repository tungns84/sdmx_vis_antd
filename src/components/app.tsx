import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import useSize from '@react-hook/size';
import * as R from 'ramda';
import { Layout } from 'antd';
import Footer from './footer';
import { updateAppBarsOffset } from '../ducks/app';
import { getIsFull } from '../selectors';
import Page from './Page';
import { getUser } from '../selectors/app.js';
import AppBars from './AppBars';
import styles from './app.module.css';

const { Content } = Layout;

interface AppProps {
  children?: React.ReactNode;
}

/**
 * Main App Layout Component
 * Migrated from MUI to AntD
 * - Grid container → Layout
 * - Grid items → Layout sections
 * - makeStyles → CSS modules
 */
const App: React.FC<AppProps> = ({ children }) => {
  const isFull = useSelector(getIsFull());
  const location = useLocation();
  const dispatch = useDispatch();
  const appBarsRef = useRef<HTMLDivElement>(null);
  const [, appBarsHeight] = useSize(appBarsRef);

  useEffect(() => {
    dispatch(updateAppBarsOffset(appBarsHeight));
  }, [appBarsHeight, dispatch]);

  return (
    <Layout className={styles.root}>
      {/* Header Section */}
      <div ref={appBarsRef}>
        <AppBars />
      </div>
      
      {/* Main Content */}
      <Content className={styles.content}>
        {children}
      </Content>
      
      {/* Footer Section */}
      {!isFull && (
        <div className={styles.footerContainer}>
          <Footer />
        </div>
      )}
    </Layout>
  );
};

export default App;
