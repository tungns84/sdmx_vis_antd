import * as R from 'ramda';
import { searchConstants } from '../../lib/search';
import { formatMessage } from '../../i18n';
import { defineMessages } from 'react-intl';
import { getSpaceFromDatasourceId, getSpaceFromUrl } from '../../lib/settings';

const messages = defineMessages({
  datasourceId: { id: 'de.data.source' },
  agencyId: { id: 'de.search.agencyId' },
  version: { id: 'de.search.version' },
  dataflowId: { id: 'vx.config.display.code' },
});

const getStaticMessage = (intl) =>
  R.cond([
    [
      R.equals(searchConstants.DATASOURCE_ID),
      R.always(formatMessage(intl)(messages.datasourceId)),
    ],
    [
      R.equals(searchConstants.AGENCY_ID),
      R.always(formatMessage(intl)(messages.agencyId)),
    ],
    [
      R.equals(searchConstants.VERSION_ID),
      R.always(formatMessage(intl)(messages.version)),
    ],
    [
      R.equals(searchConstants.DATAFLOW_ID),
      R.always(formatMessage(intl)(messages.dataflowId)),
    ],
    [R.T, R.identity],
  ]);

export const setLabel =
  ({ intl }) =>
  ({ id, label, ...rest }) => ({
    id,
    label:
      R.isNil(label) || R.equals(label, 'datasourceId')
        ? getStaticMessage(intl)(id)
        : label,
    ...rest,
  });

export const setHighlights =
  ({ intl }) =>
  (highlight) => [
    R.pipe(R.head, getStaticMessage(intl))(highlight),
    R.pipe(R.last, R.pluck('label'))(highlight),
  ];

export const getAccessor =
  (isIdHidden) =>
  ({ label, code }) => {
    if (isIdHidden) {
      return label;
    }
    return R.isNil(code) || R.isEmpty(code) ? label : `${label} (${code})`;
  };

export const prepareHomeFacets = (facets = [], intl) => {
  if (R.isEmpty(facets)) return [];
  return R.map(
    R.pipe(
      setLabel({ intl }),
      R.over(
        R.lensProp('values'),
        R.ifElse(
          R.isEmpty,
          R.identity,
          R.pipe(
            R.filter(
              R.pipe(R.prop('level'), R.anyPass([R.isNil, isNaN, R.gte(1)])),
            ),
            R.groupBy(
              R.pipe(
                R.prop('parentId'),
                R.ifElse(R.isNil, R.always('orphans'), R.identity),
              ),
            ),
            R.converge(
              (orphans, children) =>
                R.map((orphan) =>
                  R.assoc(
                    'subtopics',
                    R.pipe(R.propOr([], R.prop('id', orphan)))(children),
                    orphan,
                  ),
                )(orphans),
              [R.prop('orphans'), R.dissoc('orphans')],
            ),
          ),
        ),
      ),
    ),
    facets,
  );
};

export const getDatasource = ({ dataflowResult, externalReference }) => {
  const externalDatasource = externalReference?.datasource;

  const space = R.isNil(externalReference)
    ? getSpaceFromDatasourceId(dataflowResult.datasourceId)
    : getSpaceFromUrl(externalDatasource?.url);

  return space || externalDatasource;
};
