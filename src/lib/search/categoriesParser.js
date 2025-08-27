/*
 * expect a list of sfs facet values (categories):
 * "0|United Kingdom#GBR#"
 * "0|United States#USA#"
 * "0|European Union#EU#"
 * "1|Non-OECD economies#WXOECD#|Argentina#ARG#"
 * "1|Non-OECD economies#WXOECD#|Brazil#BRA#"
 * "1|Non-OECD economies#WXOECD#|China (People’s Republic of)#CHN#"
 * "1|Non-OECD economies#WXOECD#|Egypt#EGY#"
 * "1|Non-OECD economies#WXOECD#|Ethiopia#ETH#"
 *
 * return arrays of label in a compliant visions format
 * handling display and tooltip:
 * ['Hierarchical category', [
 *   ['Italy', 'Nord-ouest', 'Piemonte', 'Torino', 'San Francesco al Campo'],
 *   ['Belgium', 'Flanders'],
 * ]],
 * Flanders is displayed: ...> Flanders
 * Tooltip contains the path: Belgium > Flanders
 *
 * ['None Hierarchical category ', ['Overnights visitors', 'Total']]
 * Display without tooltip: Overnights visitors, Total
 */

import * as R from 'ramda';
import { setFormat } from './valueParser';

export const pathParser = (path) => {
  return R.pipe(
    R.split('|'),
    R.tail, // drop level
    R.map(setFormat), // drop ids
  )(path);
};

export default (values) => {
  return R.pipe(
    R.reduce((memo, value) => {
      const labels = pathParser(value);
      // rootLabel is used as an identifier
      // label collisions are handled by sfs during indexing
      // ids are just informative here (hence dropped in pathParser)
      const rootLabel = R.head(labels);
      if (R.length(R.propOr([], rootLabel, memo)) < R.length(labels)) {
        memo[rootLabel] = labels;
      }
      return memo;
    }, {}),
    R.values,
    R.map(R.ifElse(R.pipe(R.length, R.equals(1)), R.head, R.identity)),
  )(values);
};
