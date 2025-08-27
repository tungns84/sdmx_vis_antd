import { useQuery } from 'react-query';
import useSdmx from './useSdmx';

export default (
  ctx = {},
  {
    errorHandler,
    successHandler,
    beforeHook,
    transformerHook,
    isEnabled,
    isForceEnabled,
    isNotCached,
  } = {},
) => {
  const { queryKeyFactory, queryFnFactory, queryParamsFactory } = useSdmx({
    beforeHook,
    transformerHook,
    isEnabled,
    isForceEnabled,
  });

  const queryKey = queryKeyFactory(ctx);
  const params = queryParamsFactory();

  let queryOptions = {};
  if (isNotCached) queryOptions.cacheTime = 0;

  const query = useQuery({
    ...params,
    ...queryOptions,
    queryKey,
    queryFn: queryFnFactory(ctx, { queryKey }),
    meta: { queryKey, successHandler, errorHandler },
  });

  return { queryKey, isEnabled: params.enabled, ...query };
};
