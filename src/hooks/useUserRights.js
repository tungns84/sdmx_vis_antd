import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getExtAuthOptions, getToken, getUser } from '../selectors/app';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getDatasource } from '../selectors/sdmx';
import { withAuthorizationHeader } from '../api/sdmx/utils';

export default () => {
  const user = useSelector(getUser);
  const token = useSelector(getToken);
  const { id: spaceId } = useSelector(getDatasource);
  const { credentials, isAnonymous } = useSelector(getExtAuthOptions(spaceId));
  const authzServerUrl = window.CONFIG.member?.scope?.authzServerUrl;

  const isEnabled = user && authzServerUrl && !R.isEmpty(authzServerUrl);

  const { headers } = withAuthorizationHeader({
    token,
    spaceId,
    credentials,
    isAnonymous,
  })({});
  const query = useQuery({
    queryKey: ['userRights', token],
    queryFn: () =>
      axios
        .get(`${authzServerUrl}/AuthorizationRules/me`, { headers })
        .then((res) => R.path(['data', 'payload'], res)),
    isEnabled,
  });

  return {
    rights: query.data || [],
  };
};
