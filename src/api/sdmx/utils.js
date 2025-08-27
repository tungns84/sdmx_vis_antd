import * as R from 'ramda';
import { isSpaceExternal, hasExternalAuth } from '../../lib/settings';

export const HTTP_AUTH_HEADER = 'Authorization';

export const withAuthorizationHeader =
  ({ credentials, isAnonymous, token, spaceId }) =>
  (requestArgs) => {
    const requestHeaders = R.propOr({}, 'headers', requestArgs);

    const isExternal = R.either(isSpaceExternal, hasExternalAuth)(spaceId);

    const headers = R.cond([
      [
        R.always(credentials && !isAnonymous),
        R.assoc(HTTP_AUTH_HEADER, `Basic ${credentials}`),
      ],
      [
        R.always(!isAnonymous && !R.isNil(token) && !isExternal),
        R.assoc(HTTP_AUTH_HEADER, `Bearer ${token}`),
      ],
      [R.T, R.omit([HTTP_AUTH_HEADER])],
    ])(requestHeaders);

    return { ...requestArgs, headers };
  };
