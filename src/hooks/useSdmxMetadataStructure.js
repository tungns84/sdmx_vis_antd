import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import useSdmxQuery from './sdmx/useSdmxQuery';
import {
  getCoordinates,
  getMSDIdentifiers,
  getMSDRequestArgs,
} from '../selectors/metadata';
import { getDatasource } from '../selectors/sdmx';
import { isMetadataSupported } from '../lib/sdmx/metadata';

const IN_CACHE_PROPS = ['msd'];

export default () => {
  const datasource = useSelector(getDatasource);
  const coordinates = useSelector(getCoordinates);
  const msdIdentifiers = useSelector(getMSDIdentifiers);
  const requestArgs = useSelector(getMSDRequestArgs);

  const isMsdReferenced = !R.isNil(msdIdentifiers);
  const isMetadataRequested = !R.isNil(coordinates);
  const isEnabled =
    isMetadataSupported(datasource) && isMsdReferenced && isMetadataRequested;

  const ctx = { method: 'getStructure', requestArgs };

  const transformerHook = (data) => ({ msd: rules2.getMSDInformations(data) });

  const query = useSdmxQuery(ctx, { isEnabled, transformerHook });

  return {
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
  };
};
