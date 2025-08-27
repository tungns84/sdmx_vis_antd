import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getRawStructureRequestArgs } from '../../selectors/sdmx';
import { getRequestArgs } from '@sis-cc/dotstatsuite-sdmxjs';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import useSdmxQuery from './useSdmxQuery';

export default ({ hclRefs = [], afterHook = R.identity }) => {
  const { datasource } = useSelector(getRawStructureRequestArgs);
  const isEnabled = !R.isEmpty(hclRefs);

  const requestsArgs = R.map(({ agencyId, code, version }) => {
    return getRequestArgs({
      identifiers: { agencyId, code, version },
      datasource,
      type: 'hierarchicalcodelist',
    });
  }, hclRefs);

  const ctx = {
    method: 'getHierarchicalCodelists',
    requestsArgs,
  };

  const transformerHook = (hcls) => {
    return R.pipe(
      R.addIndex(R.reduce)((memo, { hierarchy, codelistId }, index) => {
        const hcl = R.nth(index, hcls);
        if (R.isNil(hcl)) return memo;
        return R.pipe(
          R.assocPath(
            ['parsed', codelistId],
            rules2.parseHierarchicalCodelist(hcl, hierarchy),
          ),
          R.assocPath(
            ['hCodes', codelistId],
            R.pipe(
              R.pathOr([], ['data', 'hierarchicalCodelists', 0, 'hierarchies']),
              R.find(R.propEq(hierarchy, 'id')),
              (h) => (R.isNil(h) ? [] : h.hierarchicalCodes || []),
            )(hcl),
          ),
        )(memo);
      }, {}),
    )(hclRefs);
  };

  const successHandler = ({ data }) => {
    afterHook(data);
  };

  const errorHandler = () => {
    afterHook({});
  };

  return useSdmxQuery(ctx, {
    isEnabled,
    transformerHook,
    successHandler,
    errorHandler,
    isNotCached: true,
  });
};
