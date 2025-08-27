import * as R from 'ramda';
import { getSDMXUrl } from '@sis-cc/dotstatsuite-sdmxjs';
import { search } from '../../../../lib/settings';
import { getDatasource } from '../../utils';

export const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export const getLabel = (dataflow) => {
  return R.includes('datasourceId', R.propOr([], 'excludedFacetIds', search))
    ? null
    : dataflow.datasourceId;
};

export const getCsvFileUrl = ({ dataflowResult, externalReference }) => {
  const { agencyId, dataflowId, version } = dataflowResult;

  const url = getSDMXUrl({
    identifiers: externalReference?.identifiers || {
      agencyId,
      code: dataflowId,
      version,
    },
    datasource: getDatasource({ dataflowResult, externalReference }),
    type: 'data',
  });

  return `${url}&format=csvfile`;
};
