import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import makeStyles from '@mui/styles/makeStyles';
import * as R from 'ramda';
import { Spotlight } from '@sis-cc/dotstatsuite-visions';
import SisccAppBar from './visions/SisccAppBar';
import DeAppBar from './visions/DeAppBar';
import { FormattedMessage, formatMessage } from '../i18n';
import { changeLocale } from '../ducks/app';
import { changeTerm, resetSearch } from '../ducks/search';
import { resetDataflow } from '../ducks/sdmx';
import { getIsFull } from '../selectors';
import {
  getLocale,
  getIsRtl,
  getPathname,
  getTerm,
  getSearchResultNb,
  getIsBypass,
} from '../selectors/router';
import { getHasNoSearchParams } from '../selectors/search';
import { getAsset, getApp, locales } from '../lib/settings';
import messages from './messages';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    zIndex: 0,
  },
}));

const TopBar = ({ isRtl, localeId }) => {
  const dispatch = useDispatch();
  return (
    <SisccAppBar
      logo={getAsset('header', localeId)}
      locales={R.keys(locales)}
      logoLink={getApp('headerLink', localeId)}
      localeId={localeId}
      isRtl={isRtl}
      changeLocale={(localeId) => dispatch(changeLocale(localeId))}
    />
  );
};

TopBar.propTypes = {
  isRtl: PropTypes.bool,
  localeId: PropTypes.string,
};

const BottomBar = ({ isVis, isRtl, localeId }) => {
  const dispatch = useDispatch();
  const hasNoSearchParams = useSelector(getHasNoSearchParams);
  const searchResultNb = useSelector(getSearchResultNb);
  const bypass = useSelector(getIsBypass);
  const term = useSelector(getTerm);
  const intl = useIntl();
  if (hasNoSearchParams && !isVis) {
    return null;
  }
  const logo = getAsset('subheader', localeId);
  const goHome = () => dispatch(resetSearch());
  const goBackSearch = !isVis
    ? null
    : hasNoSearchParams || (searchResultNb <= 1 && bypass && !term)
      ? goHome
      : () => dispatch(resetDataflow());
  const handleChangeTerm = (...args) => dispatch(changeTerm(...args));

  return (
    <DeAppBar
      logo={logo}
      goHome={goHome}
      goBack={goBackSearch}
      goBackLabel={<FormattedMessage id="de.search.back" />}
    >
      {!hasNoSearchParams && !isVis && (
        <Spotlight
          hasClearAll
          hasCommit
          action={handleChangeTerm}
          placeholder={formatMessage(intl)(messages.placeholder)}
          isRtl={isRtl}
          term={term}
        />
      )}
    </DeAppBar>
  );
};

BottomBar.propTypes = {
  isRtl: PropTypes.bool,
  isVis: PropTypes.bool,
  localeId: PropTypes.string,
};

const AppBars = (_, ref) => {
  const isVis = useSelector(getPathname) === '/vis';
  const isRtl = useSelector(getIsRtl);
  const classes = useStyles();
  const localeId = useSelector(getLocale);
  const isFull = useSelector(getIsFull());
  return (
    <div
      className={classes.container}
      style={{ position: isVis ? 'fixed' : 'static' }}
      ref={ref}
    >
      {!isFull && (
        <>
          <TopBar isRtl={isRtl} localeId={localeId} />
          <BottomBar isVis={isVis} isRtl={isRtl} localeId={localeId} />
        </>
      )}
    </div>
  );
};

export default forwardRef(AppBars);
