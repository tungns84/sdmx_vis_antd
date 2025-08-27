import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage, formatMessage } from '../../i18n';
import * as R from 'ramda';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ExpansionPanel, NoData, Loading } from '@sis-cc/dotstatsuite-visions';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LensIcon from '@mui/icons-material/Lens';
import { visuallyHidden } from '@mui/utils';
import { PANEL_MORE_FILTERS } from '../../utils/constants';
import NarrowFilters from '../vis-side/side-container';
import FiltersHelp from '../filters-help';
import Dataflows from './dataflows';
import Pagination from './pagination';
import { countNumberOf } from '../../utils';
import {
  getFacet,
  getHasAccessibility,
  getIsBypass,
  getLocationState,
  getSearchResultNb,
  getViewer,
} from '../../selectors/router';
import Page from '../Page';
import { ID_SEARCH_PAGE } from '../../css-api';
import { setLabel } from './utils';
import messages, { toolbarMessages } from '../messages';
import { defaultFacetsNumber, search } from '../../lib/settings';
import Sort from './Sort';
import { changeDataflow } from '../../ducks/sdmx';
import { useIntl } from 'react-intl';
import useSearchResults from '../../hooks/search/useSearchResults';
import {
  changeConstraints,
  changeFacet,
  FIELD_IDS,
  HANDLE_SEARCH,
} from '../../ducks/search';
import { getVisUrl } from '../../utils/router';
import { getSelectedValuesWithPath } from '../../utils/used-filter';
import useSearchConfig from '../../hooks/search/useSearchConfig';
import categoriesParser from '../../lib/search/categoriesParser';
import UsedFilters from '../UsedFilters';
import { useSearchFacets } from '../../hooks/useSearchFacets';
import { getUser } from '../../selectors/app.js';
import { Button } from '../visions/DeToolBar/helpers';
import ShareIcon from '@mui/icons-material/Share';
import ShortUrl from './ShortUrl';
import Facets from './results/facets';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0,
  },
  side: {
    paddingTop: 37,
    [theme.breakpoints.between('xs', 'md')]: {
      paddingTop: 0,
      minWidth: '100%',
    },
    [theme.breakpoints.only('md')]: {
      paddingRight: theme.spacing(2),
      minWidth: '40%',
      maxWidth: '40%',
    },
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(2),
      minWidth: '33.33%',
      maxWidth: '33.33%',
    },
    marginBottom: theme.spacing(2.5),
  },
  main: {
    width: '100%',
    display: 'flex',
    alignSelf: 'center',
    padding: '12px 24px 0',
    // breakpoint length - padding left and right
    [theme.breakpoints.down('sm')]: {
      padding: '48px 16px 0',
      maxWidth: 400,
    },
    [theme.breakpoints.only('sm')]: {
      maxWidth: 600,
      minWidth: 600,
    },
    [theme.breakpoints.only('md')]: {
      maxWidth: 960,
      minWidth: 960,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1280,
      minWidth: 1280,
    },
  },
  results: {
    width: 'inherit',
    overflow: 'hidden',
  },
  appliedFilters: {
    borderBottom: `2px solid ${theme.palette.grey[700]}`,
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    padding: theme.spacing(0.25, 0.5),
  },
  divider: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[700],
  },
}));

const Results = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const classes = useStyles();
  const searchResultNb = useSelector(getSearchResultNb);
  const facet = useSelector(getFacet);
  const accessibility = useSelector(getHasAccessibility);
  const locationState = useSelector(getLocationState);
  const viewer = useSelector(getViewer);
  const bypass = useSelector(getIsBypass);
  const isAuthenticated = !!useSelector(getUser);

  const {
    isLoading: isLoadingResults,
    term,
    localeId,
    data,
    rows,
  } = useSearchResults();
  const { data: configData, isLoading: isLoadingConfig } = useSearchConfig({
    localeId,
  });
  const isLoading = isLoadingConfig || isLoadingResults;

  useEffect(() => {
    if (!data?.searchResultNb) return;
    dispatch({
      type: HANDLE_SEARCH,
      replaceHistory: {
        pathname: '/',
        payload: { searchResultNb: data?.searchResultNb },
      },
    });
  }, [data]);

  const dataflows = useMemo(() => {
    if (!data?.dataflows || isLoading) return [];
    const homeFacetIds = R.pipe(
      R.propOr([], 'facets'),
      R.pluck('id'),
      R.reject(R.flip(R.includes)(FIELD_IDS)),
    )(configData);
    return R.map((dataflow) => {
      const dataflowHomeFacetIds = R.difference(
        homeFacetIds,
        R.pluck(0, R.defaultTo([], dataflow.highlights)),
      );
      const categories = R.pipe(
        R.pick(dataflowHomeFacetIds),
        R.toPairs,
        R.map(([facetId, values]) => [facetId, categoriesParser(values)]),
      )(dataflow);
      return {
        ...dataflow,
        url: getVisUrl(locationState, dataflow),
        categories,
      };
    }, data?.dataflows);
  }, [locationState, data?.dataflows, isLoading]);

  const currentRows = useMemo(() => {
    return R.isNil(rows) ? R.length(dataflows) : rows;
  }, [rows, dataflows]);

  const constraints = useMemo(() => {
    if (!data?.facets) return [];
    return R.pipe(
      R.filter(R.pipe(R.prop('count'), R.flip(R.gt)(0))),
      getSelectedValuesWithPath,
    )(data?.facets);
  }, [data?.facets]);

  const [expandedFacets, hiddenFacets] = useSearchFacets(
    data?.facets,
    searchResultNb,
    search,
    defaultFacetsNumber,
  );

  const handleChangeConstraints = (...args) =>
    dispatch(changeConstraints(...args));
  const handleChangeFacet = (...args) => dispatch(changeFacet(...args));
  const NO_RESULT_MESSAGE_ID = 'noResultMessage';
  const SEARCH_RESULTS_COUNT_ID = 'searchResultsCount';
  useEffect(() => {
    if (searchResultNb === 1 && !term && bypass) {
      dispatch(changeDataflow(R.head(dataflows), 'replaceHistory', viewer));
    }
  }, [term, dataflows, bypass, searchResultNb]);

  const isBlank = R.isEmpty(dataflows);

  useEffect(() => {
    if (R.not(accessibility)) return;
    if (R.not(isLoading)) {
      R.not(isBlank)
        ? document.getElementById(SEARCH_RESULTS_COUNT_ID).focus()
        : document.getElementById(NO_RESULT_MESSAGE_ID).focus();
    }
    if (R.and(R.not(isLoading), R.not(isBlank)))
      document.getElementById(SEARCH_RESULTS_COUNT_ID).focus();
  }, [isLoading, isBlank]); //eslint-disable-line react-hooks/exhaustive-deps

  const localizedConstraints = useMemo(() => {
    if (!constraints) return {};
    return R.map(setLabel({ intl }), constraints);
  }, [constraints, intl]);

  const counter = countNumberOf(localizedConstraints);
  const labels = {
    reducingChip: formatMessage(intl)(messages.reducingChip),
  };

  const appliedFilters = [
    {
      items: localizedConstraints,
      onDelete: handleChangeConstraints,
      labelRenderer: R.prop('label'),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <Page id={ID_SEARCH_PAGE} alignSelf="center">
      {R.or(R.and(isBlank, R.not(isLoading)), isLoading) && (
        <Grid item className={classes.main}>
          <Grid container className={classes.margin}>
            <Grid item xs={12} style={{ marginTop: 200 - 64 * 2 }}>
              {isLoading && (
                <Loading
                  message={<FormattedMessage id="de.search.list.loading" />}
                />
              )}
              {R.and(isBlank, R.not(isLoading)) && (
                <NoData
                  message={<FormattedMessage id="de.search.list.blank" />}
                />
              )}
            </Grid>
            {isLoading && (
              <Typography
                tabIndex={0}
                aria-live="assertive"
                style={visuallyHidden}
              >
                <FormattedMessage id="de.search.list.loading" />
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
      {R.and(R.not(isLoading), R.not(isBlank)) && (
        <Grid item className={classes.main}>
          <Grid
            container
            className={classes.margin}
            wrap={isNarrow ? 'wrap' : 'nowrap'}
          >
            <div className={classes.side}>
              {!isNarrow && <FiltersHelp isSearch />}
              <NarrowFilters
                isNarrow={isNarrow}
                isPopper
                isSearch
                popperLabels={{
                  title: (
                    <Typography id="filtersHelpers" variant="body2">
                      <FormattedMessage
                        id="de.filters.search.help"
                        values={{
                          icon: <LensIcon style={{ fontSize: 5 }} />,
                        }}
                      />
                    </Typography>
                  ),
                  ariaLabel: formatMessage(intl)(messages.help),
                }}
              >
                <Facets
                  accessibility={accessibility}
                  facets={expandedFacets}
                  activePanelId={facet}
                  onChangeActivePanel={handleChangeFacet}
                  changeSelection={handleChangeConstraints}
                />
                {!R.isEmpty(hiddenFacets) && (
                  <ExpansionPanel
                    key={PANEL_MORE_FILTERS}
                    id={PANEL_MORE_FILTERS}
                    label={formatMessage(intl)(messages.moreFilters, {
                      count: R.length(hiddenFacets),
                    })}
                    overflow
                    moreFilters
                  >
                    <Facets
                      accessibility={accessibility}
                      facets={hiddenFacets}
                      activePanelId={facet}
                      onChangeActivePanel={handleChangeFacet}
                      changeSelection={handleChangeConstraints}
                    />
                  </ExpansionPanel>
                )}
              </NarrowFilters>
            </div>
            <div className={classes.results}>
              {R.not(R.isEmpty(localizedConstraints)) && (
                <div
                  className={classes.appliedFilters}
                  style={{ paddingTop: isNarrow ? 0 : 60 }}
                >
                  <UsedFilters
                    counter={counter}
                    data={appliedFilters}
                    labels={labels}
                    clearAllLabel={formatMessage(intl)(messages.clear)}
                    onDeleteAll={handleChangeConstraints}
                    dataCount={searchResultNb}
                    dataCountLabel={
                      <FormattedMessage
                        id="de.search.list.status"
                        values={{ size: searchResultNb }}
                      />
                    }
                    dataCountId={SEARCH_RESULTS_COUNT_ID}
                  />
                </div>
              )}
              <div className={classes.resultsHeader}>
                <div>
                  {R.isEmpty(localizedConstraints) && (
                    <Typography
                      variant="body2"
                      style={{
                        fontFamily: 'Roboto Slab, serif',
                        fontSize: '17px',
                      }}
                      aria-label={formatMessage(intl)(
                        messages.deSearchFreeTextList,
                        {
                          size: searchResultNb,
                        },
                      )}
                      id={SEARCH_RESULTS_COUNT_ID}
                    >
                      <FormattedMessage
                        id="de.search.list.status.freetext"
                        values={{ size: searchResultNb }}
                      />
                    </Typography>
                  )}{' '}
                </div>
                <div style={{ display: 'flex' }}>
                  <Sort />
                  {isAuthenticated && (
                    <Button
                      startIcon={<ShareIcon />}
                      onClick={() => setOpen(!open)}
                      selected={open}
                      aria-expanded={open}
                    >
                      {formatMessage(intl)(toolbarMessages.share)}
                    </Button>
                  )}
                </div>
              </div>
              <ShortUrl open={open} setOpen={setOpen} />
              <Dataflows dataflows={dataflows} />
              <Grid container justifyContent="flex-end">
                <Pagination rows={currentRows} />
              </Grid>
            </div>
          </Grid>
        </Grid>
      )}
    </Page>
  );
};

export default Results;
