import React, { Fragment, useMemo } from 'react';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import { FormattedMessage, formatMessage } from '../../i18n';
import { useIntl } from 'react-intl';
import Typography from '@mui/material/Typography';
import {
  Logo,
  Spotlight,
  LabelDivider,
  CollapseButtons,
  Loading,
} from '@sis-cc/dotstatsuite-visions';
import Grid from '@mui/material/Grid';
import Page from '../Page';
import { ID_HOME_PAGE } from '../../css-api';
import {
  homeFacetLevel2Clickable,
  isHomeFacetCentered,
  selectedFacetId,
  setOfHideHomeFacetItemIDs,
  setOfHideHomeAndResultFacetItemIDs,
  getAsset,
  hasNoSearch,
} from '../../lib/settings/index';
import messages from '../messages';
import { getAccessor, prepareHomeFacets } from './utils';
import { MARGE_SIZE } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { changeTerm, changeConstraints } from '../../ducks/search';
import { getLocale } from '../../selectors/router';
import useSearchConfig from '../../hooks/search/useSearchConfig';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor:
      R.path(['palette', 'tertiary', 'main'])(theme) ||
      theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  container: {
    padding: theme.spacing(5, 1.25),
    flexWrap: 'nowrap', // edge
  },
  textColor: {
    color: theme.palette.common.white,
  },
  spotlight: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  content: {
    padding: `0 ${MARGE_SIZE}%`,
  },
}));

const Home = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const localeId = useSelector(getLocale);
  const { data, isLoading } = useSearchConfig({ localeId });
  const preparedFacets = useMemo(() => {
    if (!data) return [];
    if (!data.facets) return [];
    return prepareHomeFacets(data.facets, intl);
  }, [data, intl]);
  const handleChangeTerm = (...args) => dispatch(changeTerm(...args));
  const handleChangeConstraints = (...args) =>
    dispatch(changeConstraints(...args, { bypass: true }));

  const logo = getAsset('splash', localeId);

  return (
    <Page id={ID_HOME_PAGE} classNames={[classes.page]}>
      <Grid
        item
        sm={12}
        md={7}
        container
        direction="column"
        className={classes.container}
      >
        <Logo logo={logo} alt={formatMessage(intl)(messages.logoDe)}>
          <Typography variant={'h6'} className={classes.textColor}>
            <FormattedMessage id="de.search.splash" />
          </Typography>
        </Logo>
        {!hasNoSearch && (
          <Grid
            container
            item
            xs={12}
            direction="column"
            className={classes.content}
          >
            {isLoading && <Loading color="secondary" />}
            {!isLoading && (
              <>
                <Grid item className={classes.spotlight}>
                  <Spotlight
                    hasClearAll
                    hasCommit
                    withBorder
                    fullWidth
                    action={handleChangeTerm}
                    placeholder={formatMessage(intl)(messages.placeholder)}
                    withAutoFocus
                  />
                </Grid>
                {R.not(R.isEmpty(preparedFacets)) && (
                  <Grid item className={classes.facets}>
                    <LabelDivider
                      label={<FormattedMessage id="de.search.topics.browse" />}
                      withMargin
                    />
                    <CollapseButtons
                      items={preparedFacets}
                      action={handleChangeConstraints}
                      isSecondLevelClikable={homeFacetLevel2Clickable}
                      justify={isHomeFacetCentered ? 'center' : 'flex-start'}
                      selectedItemId={selectedFacetId(preparedFacets)}
                      labelAccessor={(props, facetId) =>
                        getAccessor(
                          setOfHideHomeAndResultFacetItemIDs.has(facetId) ||
                            setOfHideHomeFacetItemIDs.has(facetId),
                        )(props)
                      }
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        )}
      </Grid>
    </Page>
  );
};

export default Home;
