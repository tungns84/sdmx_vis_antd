import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { getDatasource, getExternalReference } from '../selectors/sdmx';
import { getDataflow, getLocale } from '../selectors/router';
import { getRequestArgs, parseDataRange } from '@sis-cc/dotstatsuite-sdmxjs';
import useSdmxQuery from './sdmx/useSdmxQuery';

export default () => {
  const datasource = useSelector(getDatasource);
  const locale = useSelector(getLocale);
  const externalRef = useSelector(getExternalReference);
  const dataflow = useSelector(getDataflow);

  const requestArgs = useMemo(() => {
    const _dataflow = R.isNil(externalRef) ? dataflow : externalRef;
    return getRequestArgs({
      datasource,
      identifiers: {
        code: R.prop('dataflowId', _dataflow),
        ...R.pick(['agencyId', 'version'], _dataflow),
      },
      type: 'data',
      range: [0, 0],
      locale,
    });
  }, [datasource, dataflow, externalRef, locale]);

  const ctx = {
    method: 'getBlankData',
    requestArgs: { ...requestArgs, datasourceId: R.prop('id', datasource) },
  };

  const { data } = useSdmxQuery(ctx, {
    //isEnabled: viewerId === OVERVIEW && !!R.prop('hasRangeHeader', datasource),
    isEnabled: false,
  });

  const range = parseDataRange(data);

  const attributes = useMemo(() => {
    if (!data) return [];

    const annotations = R.pathOr(
      [],
      ['data', 'structure', 'annotations'],
      data,
    );

    const datasetAnnotations = R.props(
      R.pathOr([], ['data', 'dataSets', 0, 'annotations'], data),
      annotations,
    );

    const hiddenCodes = R.pipe(
      R.find(R.propEq('NOT_DISPLAYED', 'type')),
      R.when(R.isNil, R.always({})),
      R.propOr('', 'title'),
      R.split(','),
      R.indexBy(R.identity),
    )(datasetAnnotations);

    return R.pipe(
      R.pathOr({}, ['data', 'structure', 'attributes']),
      ({ observation = [], dataSet = [] }) => R.concat(observation, dataSet),
      R.reduce((acc, attr) => {
        if (R.length(attr.values || []) !== 1) return acc;
        if (
          R.has(attr.id, hiddenCodes) ||
          R.has(`${attr.id}=${R.path(['values', 0, 'id'], attr)}`, hiddenCodes)
        )
          return acc;
        const attrAnnots = R.props(attr.annotations || [], annotations);
        const valAnnots = R.props(
          R.pathOr([], ['values', 0, 'annotations'], attr),
          annotations,
        );
        const hidden = !!R.find(
          R.propEq('NOT_DISPLAYED', 'type'),
          R.concat(attrAnnots, valAnnots),
        );
        if (hidden) return acc;
        return R.append(
          {
            ...attr,
            label: attr.name,
            values: [
              {
                ...R.head(attr.values),
                label: R.path(['values', 0, 'name'], attr),
              },
            ],
          },
          acc,
        );
      }, []),
    )(data);
  }, [data]);

  return { attributes, observationsCount: R.prop('total', range) };
};
