import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import useSdmxQuery from './sdmx/useSdmxQuery';
import useSdmxMetadataStructure from './useSdmxMetadataStructure';
import {
  getAnnotations,
  getRawStructureRequestArgs,
  getTimePeriodArtefact,
} from '../selectors/sdmx';
import { getDisplay, getLocale } from '../selectors/router';
import { getDataDimensions } from '../selectors';
import {
  getMetadataRequestParams,
  getMetadataRequestUrl,
  getMetadataTimePeriodSelection,
  getPartialDataquery,
  isMetadataSupported,
} from '../lib/sdmx/metadata';
import { getCoordinates } from '../selectors/metadata';

const IN_CACHE_PROPS = ['metadataSeries'];

export default () => {
  const { datasource, identifiers } = useSelector(getRawStructureRequestArgs);
  const locale = useSelector(getLocale);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);
  const dimensions = useSelector(getDataDimensions());
  const coordinates = useSelector(getCoordinates);
  const display = useSelector(getDisplay);
  const annotations = useSelector(getAnnotations);

  const periodSelection = getMetadataTimePeriodSelection(
    coordinates || {},
    timePeriodArtefact,
  );
  const dataquery = getPartialDataquery(
    coordinates || {},
    dimensions,
    R.prop('id', timePeriodArtefact),
  );
  const { msd, isLoading: isLoadingMSD } = useSdmxMetadataStructure();

  const ctx = {
    method: 'getMetadata',
    requestArgs: {
      url: getMetadataRequestUrl(datasource, identifiers, dataquery),
      params: getMetadataRequestParams(periodSelection),
      headers: {
        Accept: R.pathOr(
          rules2.SDMX_3_0_JSON_DATA_FORMAT,
          ['headersv3', 'metadata', 'json'],
          datasource,
        ),
        'x-level': 'upperOnly',
        'accept-language': locale,
      },
    },
  };

  const hasMsd = !R.isNil(msd);
  const isMetadataRequested = !R.isNil(coordinates);
  const isEnabled =
    isMetadataRequested && isMetadataSupported(datasource) && hasMsd;

  const notDisplayedIds = rules2.getNotDisplayedIds(annotations);

  const transformerHook = (data) => ({
    metadataSeries: rules2.parseMetadataSeries(data.data, {
      display,
      locale,
      dimensions,
      attributes: msd.attributes,
      notDisplayedIds: notDisplayedIds.hiddenValues,
    }),
  });

  const query = useSdmxQuery(ctx, { isEnabled, transformerHook });

  return {
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
    isLoading: query.isLoading || isLoadingMSD,
  };
};
