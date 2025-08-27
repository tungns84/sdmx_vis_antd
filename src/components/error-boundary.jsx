import React from 'react';
import * as R from 'ramda';
import { ErrorBoundary } from 'react-error-boundary';
import Typography from '@mui/material/Typography';
import { ID_ERROR_PAGE } from '../css-api';
import { getAsset } from '../lib/settings';
import { fromSearchToState } from '../utils/router';
import { Logo } from '@sis-cc/dotstatsuite-visions';
import Page from './Page';
import { FormattedMessage } from '../i18n';
import { useTheme } from '@emotion/react';

const FallbackComponent = () => {
  const theme = useTheme();

  if (!theme) return <h1>Whoops, something went wrong on our end.</h1>;

  // selector are not possible in this component
  const localeId = R.prop('locale', fromSearchToState(window.location.search));

  const styles = {
    // no theme when final because above theme provider
    backgroundColor: theme?.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  return (
    <Page id={ID_ERROR_PAGE} styles={styles}>
      <div style={{ paddingTop: theme ? theme.spacing(10) : 100 }}>
        <Logo logo={getAsset('subheader', localeId)}>
          <Typography variant="h6" color="secondary">
            <FormattedMessage id="de.error.title" />
          </Typography>
        </Logo>
      </div>
    </Page>
  );
};

const FunctionalErrorBoundary = ({ children }) => {
  const handleError = (error, info) => {
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
