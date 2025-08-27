import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { formatMessage } from '../i18n';
import {
  defaultRelatedDataflowsNumber,
  getAsset,
  search,
} from '../lib/settings';
import { getVisDataflow, getVisDimensionFormat } from '../selectors';
import { getDefaultTitleLabel } from '../selectors/data';
import { getDataflow, getLocale } from '../selectors/router';
import { getActualContentConstraint, getDimensions } from '../selectors/sdmx';
import {
  groupAttributes,
  groupDimensions,
  isLast,
} from '../components/vis/overview/utils';
import useSdmxBlankData from './useSdmxBlankData';
import { makeSelectedHierarchySchemesList } from '../utils/structured-hierarchies-overview';
import { getVisUrl } from '../utils/router';
import useRelatedDataflows from './search/useRelatedDataflows';
import useSdmxStructure from './useSdmxStructure';
import { useMemo } from 'react';
import { ASC, sortByLabel } from '../utils/sort';
import { getObservationCount } from '../lib/sdmx/structure';

const messages = defineMessages({
  relatedFiles: { id: 'de.related.files' },
  observationsCount: { id: 'de.observations.count' },
  dataSource: { id: 'de.data.source' },
  validFrom: { id: 'de.last.updated' },
  complementaryData: { id: 'de.complementary.data' },
  moreComplementaryData: { id: 'de.more.complementary.data' },
});

export default () => {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const labelAccessor = useSelector(
    getVisDimensionFormat({ id: 'id', name: 'label' }),
  );
  const nameAccessor = useSelector(getVisDimensionFormat());
  const dataflow = useSelector(getVisDataflow);
  const { datasourceId } = useSelector(getDataflow);
  const dimensions = useSelector(getDimensions);
  const { attributes, observationsCount: blankObservationsCount } =
    useSdmxBlankData();
  const label = useSelector(getDefaultTitleLabel);
  const contentConstraints = useSelector(getActualContentConstraint);
  const {
    externalResources = [],
    dataflowDescription,
    hierarchySchemes = [],
  } = useSdmxStructure();
  const { relatedIndexedDataflows = [] } = useRelatedDataflows();

  const defaultObservationsCount = getObservationCount(contentConstraints);
  const validFrom = R.prop('validFrom', contentConstraints);

  const observationsCount = R.defaultTo(
    defaultObservationsCount,
    blankObservationsCount,
  );

  const footerProps = {
    isSticky: true,
    source: {
      label,
      link: window.location.href,
    },
    logo: getAsset('viewerFooter', locale),
  };
  const homeFacetIds = new Set(R.propOr([], 'homeFacetIds', search));
  const { oneDimensions, manyDimensions } = groupDimensions(
    dimensions,
    contentConstraints,
  );
  const oneAttributes = R.pipe(groupAttributes, R.propOr([], 'oneAttributes'))(
    attributes || [],
    contentConstraints,
    oneDimensions,
  );

  const dataSpaceLabel =
    window.CONFIG?.member?.scope?.spaces?.[datasourceId]?.label ||
    window.CONFIG?.member?.scope?.datasources?.[datasourceId]?.label;

  const lists = {
    dataSource: [
      {
        id: 'dataSource',
        name: formatMessage(intl)(messages.dataSource),
        values: [{ name: dataSpaceLabel }],
      },
    ],
    observationsCount: [
      {
        id: 'observationsCount',
        name: formatMessage(intl)(messages.observationsCount),
        values: [{ name: observationsCount }],
      },
    ],
    validFrom: [
      {
        id: 'validFrom',
        name: formatMessage(intl)(messages.validFrom),
        values: [
          {
            name: intl.formatDate(validFrom, {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }),
          },
        ],
      },
    ],
    relatedFiles: [
      {
        id: 'relatedFiles',
        name: formatMessage(intl)(messages.relatedFiles),
      },
    ],
    complementaryData: [
      {
        id: 'ComplementaryData',
        name: formatMessage(intl)(messages.complementaryData),
      },
    ],
    moreComplementaryData: [
      {
        id: 'moreComplementaryData',
        name: formatMessage(intl)(messages.moreComplementaryData),
      },
    ],
  };
  const selectedHierarchySchemes = R.reduce((acc, schemes) => {
    if (homeFacetIds.has(R.head(schemes)?.name)) {
      const head = R.head(schemes);
      return R.append({ ...head, values: R.tail(schemes) }, acc);
    }
    return acc;
  }, [])(hierarchySchemes);
  const makeHierarchyProps = (index, hierarchies = []) => {
    return {
      list: [hierarchies],
      accessor: nameAccessor,
      hasGroupSeparator: !isLast(
        index,
        makeSelectedHierarchySchemesList(selectedHierarchySchemes),
      ),
    };
  };

  const newDefaultRelatedDataflowsNumber = R.gt(
    defaultRelatedDataflowsNumber,
    0,
  )
    ? defaultRelatedDataflowsNumber
    : R.length(relatedIndexedDataflows);

  const [displayedComplementaryData, hiddenComplementaryData] = useMemo(() => {
    const noRelatedIndexedDataflows = R.isEmpty(relatedIndexedDataflows);
    if (noRelatedIndexedDataflows) return [[], []];

    const sortedRelatedIndexedDataflows = sortByLabel(locale, ASC, [
      R.replace(/ /g, ''),
      R.toLower,
    ])(relatedIndexedDataflows);

    return R.pipe(
      R.map((dataflow) => ({
        ...dataflow,
        dataflowId: dataflow.code,
        url: getVisUrl(
          { locale },
          { ...dataflow, dataflowId: dataflow.code, datasourceId },
        ),
      })),
      R.splitAt(newDefaultRelatedDataflowsNumber),
    )(sortedRelatedIndexedDataflows);
  }, [relatedIndexedDataflows, newDefaultRelatedDataflowsNumber]);

  return {
    title: nameAccessor(dataflow),
    labelAccessor,
    selectedHierarchySchemes: makeSelectedHierarchySchemesList(
      selectedHierarchySchemes,
    ),
    externalResources,
    dataflowDescription,
    observationsCount,
    dataSpaceLabel,
    validFrom,
    footerProps,
    oneDimensions,
    manyDimensions,
    oneAttributes,
    homeFacetIds,
    lists,
    complementaryData: [displayedComplementaryData, hiddenComplementaryData],
    makeHierarchyProps,
  };
};
