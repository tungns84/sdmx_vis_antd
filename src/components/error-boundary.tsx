import React from 'react';
import * as R from 'ramda';
import { ErrorBoundary } from 'react-error-boundary';
import { Typography, theme } from 'antd';
import { ID_ERROR_PAGE } from '../css-api';
import { getAsset } from '../lib/settings';
import { fromSearchToState } from '../utils/router';
import { Logo } from '@sis-cc/dotstatsuite-visions';
import Page from './Page';
import { FormattedMessage } from '../i18n';

const { Title } = Typography;

interface FallbackComponentProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const FallbackComponent: React.FC<FallbackComponentProps> = () => {
  const { token } = theme.useToken();

  if (!token) return <h1>Whoops, something went wrong on our end.</h1>;

  // selector are not possible in this component
  const localeId = R.prop('locale', fromSearchToState(window.location.search));

  const styles: React.CSSProperties = {
    backgroundColor: token.colorPrimary,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  return (
    <Page id={ID_ERROR_PAGE} styles={styles}>
      <div style={{ paddingTop: token.paddingLG * 5 }}>
        <Logo logo={getAsset('subheader', localeId)}>
          <Title 
            level={4} 
            style={{ 
              color: token.colorTextSecondary,
              margin: 0 
            }}
          >
            <FormattedMessage id="de.error.title" />
          </Title>
        </Logo>
      </div>
    </Page>
  );
};

interface FunctionalErrorBoundaryProps {
  children: React.ReactNode;
}

const FunctionalErrorBoundary: React.FC<FunctionalErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, info: { componentStack: string }) => {
    // Log error to an external service (ie Sentry)
    console.error(error, info); // eslint-disable-line no-console
  };

  //const resetError = () => {
  //  // Reset the state of your app so the error doesn't happen again
  //  // This could involve resetting some context or state variables
  //};

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      //onReset={resetError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FunctionalErrorBoundary;
