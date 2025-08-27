import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { getDatasource } from '../../selectors/sdmx';
import { getDataflow } from '../../selectors/router';
import { getExtAuthOptions, getToken, getUser } from '../../selectors/app.js';
import { withAuthorizationHeader } from '../../api/sdmx/utils';
import { dataUrlIsTooLong } from '../../ducks/sdmx';
import sdmxApi from '../../api/sdmx';
import { hashObject } from '../utils';

export default ({
  beforeHook = R.identity,
  transformerHook = R.identity,
  isEnabled = true,
  isForceEnabled = false,
} = {}) => {
  const dispatch = useDispatch();

  // in CONFIG, datasources is an object
  // keys are datasource ids and id inside datasource object is a space id
  const { id: spaceId, hasExternalAuth = false } = useSelector(getDatasource);
  const dataflow = useSelector(getDataflow);
  const hasDataflow = !R.isEmpty(dataflow);

  const { credentials, isAnonymous } = useSelector(getExtAuthOptions(spaceId));
  const token = useSelector(getToken);
  const user = useSelector(getUser);

  const isExtAuthEnabled = !hasExternalAuth || isAnonymous || !!credentials;
  const isMasterEnabled =
    (isEnabled && hasDataflow && isExtAuthEnabled) || isForceEnabled;

  const queryKeyFactory = (ctx) => {
    //if (R.isNil(ctx.requestArgs)) throw new Error('No request args');
    //if (R.isNil(ctx.requestsArgs)) throw new Error('No requests args');
    if (R.isNil(ctx.requestArgs) && R.isNil(ctx.requestsArgs)) {
      return ['sdmx', ctx.method, 'invalid request params'];
    }

    return [
      'sdmx',
      ctx.method,
      spaceId || 'no space',
      user ? user.email : 'anonymous',
      hashObject(ctx.requestsArgs ? ctx.requestsArgs : ctx.requestArgs),
    ];
  };

  const preparedWithAuthorizationHeader = withAuthorizationHeader({
    token,
    spaceId,
    credentials,
    isAnonymous,
  });

  const queryFnFactory =
    (ctx, { queryKey }) =>
    ({ signal }) => {
      if (isMasterEnabled) beforeHook({ queryKey });

      let requestArgs;
      let requestsArgs;
      if (ctx.requestsArgs) {
        requestsArgs = R.map(preparedWithAuthorizationHeader, ctx.requestsArgs);
      } else {
        requestArgs = preparedWithAuthorizationHeader(ctx.requestArgs);
      }
      return sdmxApi({
        method: ctx.method,
        requestArgs,
        requestsArgs,
        tooLongRequestErrorCallback: () => dispatch(dataUrlIsTooLong()),
        signal,
      }).then(transformerHook);
    };

  const queryParamsFactory = () => ({
    enabled: isMasterEnabled,
  });

  return {
    queryKeyFactory,
    queryFnFactory,
    queryParamsFactory,
  };
};
